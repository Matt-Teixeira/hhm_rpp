const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_ct_gesys_schema } = require("../../../persist/pg-schemas");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const extract = require("../../../processing/date_processing/ge_ct/extract_metadata");
const { build_upsert_str } = require("../../../util");

const {
  pg_column_sets: pg_cs
} = require("../../../utils/db/sql/pg-helpers_hhm");

// File data parsed in bulk. One regex to group array of data blocks. Second regex to parse blocks.
async function ge_ct_gesys(System, capture_datetime) {
  // an array in each parser accossiated with a file
  const parsers = System.file_config.parsers;
  const data = [];
  const extraction_data = [];

  const tube_test_re = /tube usage data reports/;

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.file_config.file_name
  };

  try {
    await System.addLogEvent(
      System.I,
      System.run_log,
      "ge_ct_gesys",
      System.cal,
      note,
      null
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    if (!System.current_file_size) return;

    await System.getFileData("read_file");

    const last_mod = (
      await System.getLastModifiedTime(System.complete_file_path)
    ).toISOString();

    const file_metadata = {
      system_id: System.sme,
      file_name: System.file_config.file_name,
      last_mod,
      source: "hhm"
    };

    if (System.delta === 0) {
      await System.push_file_dt_queue(System.run_log, file_metadata);
      return;
    }

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    // An array of matches - no .groups property
    let matches = System.file_data.match(ge_re.ct.gesys[parsers[0]]);

    if (matches === null) {
      let note = {
        job_id: System.job_id,
        sme: System.sme,
        file: System.file_config.file_name,
        re: `${ge_re.ct.gesys[parsers[0]]}`,
        message: "NO MATCH FOUND - Big Group"
      };
      await System.addLogEvent(
        System.W,
        System.run_log,
        "ge_ct_gesys",
        System.det,
        note,
        null
      );
      return;
    }

    for await (let match of matches) {
      const matchGroups = match.match(ge_re.ct.gesys[parsers[1]]);

      // matchGroups will be null if no match - log bad match here
      if (!matchGroups) {
        let note = {
          job_id: System.job_id,
          system_id: System.sme,
          prev_epoch: data[data.length - 1].epoch,
          sr_group: data[data.length - 1].sr,
          re: `${ge_re.ct.gesys[parsers[1]]}`,
          message: "NO MATCH FOUND - Small Group",
          file_data: match
        };
        await System.addLogEvent(
          System.W,
          System.run_log,
          "ge_ct_gesys",
          System.det,
          note,
          null
        );
        continue;
      }

      matchGroups.groups.host_date = `${
        matchGroups.groups.day.length === 1
          ? 0 + matchGroups.groups.day
          : matchGroups.groups.day
      }-${matchGroups.groups.month}-${matchGroups.groups.year}`;

      matchGroups.groups.system_id = System.sysConfigData.id;

      const dtObject = await generateDateTime(
        System.job_id,
        matchGroups.groups.system_id,
        System.file_config.pg_tables[0],
        matchGroups.groups.host_date,
        matchGroups.groups.host_time,
        System.sysConfigData.time_zone_id
      );

      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          date: matchGroups.groups.host_date,
          time: matchGroups.groups.host_time,
          prev_epoch: data[data.length - 1].epoch,
          sr_group: data[data.length - 1].sr,
          message: "datetime object null"
        };
        await System.addLogEvent(
          System.W,
          System.run_log,
          "ge_ct_gesys",
          System.det,
          note,
          null
        );
      }

      matchGroups.groups.capture_datetime = capture_datetime;
      matchGroups.groups.host_datetime = dtObject;

      data.push(matchGroups.groups);

      // Testing here because every group has a value in message property.
      const is_tube_data = tube_test_re.test(matchGroups.groups.message);
      if (is_tube_data) {
        extraction_data.push({
          system_id: matchGroups.groups.system_id,
          message: matchGroups.groups.message,
          host_datetime: matchGroups.groups.host_datetime
        });
      }
    }

    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);

    // console.log("\nmappedData - ge_ct");
    // console.log(System.sme);
    // console.log(mappedData);
    // console.log(mappedData[mappedData.length - 1]);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.ge.ge_ct_gesys);

    await db.any(query);

    // ** End Persist

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await System.addLogEvent(
      System.I,
      System.run_log,
      "ge_ct_gesys",
      System.det,
      note,
      null
    );

    await System.push_file_dt_queue(System.run_log, file_metadata);

    // Insert metadata
    if (extraction_data.length > 0)
      await extract(System.job_id, extraction_data, System.run_log);

    // Update Redis Cache
    await System.updateRedisFileSize();

    // Update alert.offline_hhm_conn table with host_datetime
    const resent_host_datetime =
      mappedData[mappedData.length - 1].host_datetime;

    const upsert_str = build_upsert_str(System.sme, resent_host_datetime);

    await db.any(upsert_str);
  } catch (error) {
    console.log(error);
    await System.addLogEvent(
      System.E,
      System.run_log,
      "ge_ct_gesys",
      System.cat,
      note,
      error
    );
  }
}

module.exports = ge_ct_gesys;
