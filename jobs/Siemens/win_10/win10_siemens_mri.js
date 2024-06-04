const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { win_10_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../../persist/pg-schemas");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const execLastMod = require("../../../read/exec-file_last_mod");
const { dt_now } = require("../../../util/dates");
const { build_upsert_str } = require("../../../util");

const {
  pg_column_sets: pg_cs
} = require("../../../utils/db/sql/pg-helpers_hhm");

/* NOTE ON EvtApplication_Today.txt
  This file turns over on a 24 hour intervolve; however, it also accumulates data throughout the day.
  New data is added to file head. 
*/

const win10_siemens_mri = async (System) => {
  const capture_datetime = dt_now();
  const data = [];
  lastModPath = "./read/sh/get_file_last_mod.sh";

  let line_num = 1;
  // first_line will be the most recent line data
  let first_line;

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.file_config
  };

  try {
    await System.addLogEvent(
      System.I,
      System.run_log,
      "win10_siemens_mri",
      System.cal,
      note,
      null
    );

    await System.get_redis_line();

    // Returns true if file in dir.
    if (!System.is_file_present()) return;

    const last_mod = (
      await System.getLastModifiedTime(System.complete_file_path)
    ).toISOString();

    const file_metadata = {
      system_id: System.sme,
      file_name: System.file_config.file_name,
      last_mod,
      source: "hhm"
    };

    await System.push_file_dt_queue(System.run_log, file_metadata);

    await System.get_file_data();

    for await (const line of System.file_data) {
      // Save first line (most resent parsed line) to redis
      // This process of delimiting new and old data only works because new data is appended to top of
      if (line_num === 1) first_line = line;

      // If line (in file) === redis_line, we break because we have reached point of last rpp.
      if (line == System.redis_line) {
        // Log file's last mod datetime
        const file_mod_datetime = await execLastMod(lastModPath, [
          System.complete_file_path
        ]);
        note.message = "No delta measured";
        note.last_mod = file_mod_datetime;
        await System.addLogEvent(
          System.I,
          System.run_log,
          "win10_siemens_mri",
          System.cal,
          note,
          null
        );
        break;
      }

      let matches = line.match(win_10_re[System.parsers[0]]);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          let note = {
            job_id: System.job_id,
            sme: System.sme,
            file: System.file_config,
            message: "This is not a blank new line - Bad Match",
            line: line
          };

          await System.addLogEvent(
            System.W,
            System.run_log,
            "win10_siemens_mri",
            System.det,
            note,
            null
          );
        }
      }

      matches.groups.system_id = System.sme;

      const dtObject = await generateDateTime(
        System.jobId,
        matches.groups.system_id,
        System.file_config.pg_tables[0],
        matches.groups.host_date,
        matches.groups.host_time,
        System.sysConfigData.time_zone_id
      );

      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          line,
          message: "date_time object null"
        };
        await System.addLogEvent(
          System.W,
          System.run_log,
          "win10_siemens_mri: date_time",
          System.det,
          note,
          null
        );
      }

      matches.groups.capture_datetime = capture_datetime;
      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);
      line_num++;
    }

    // No data in array if most recently parsed line in redis === first line in file. Indication of no change in file.
    // Logged above
    if (data.length === 0) return;

    const mappedData = mapDataToSchema(data, siemens_ct_mri);

    // console.log("\nmappedData - siemens_mri");
    // console.log(System.sme);
    // console.log(`Rows Inserted: ${mappedData.length}`);
    // console.log(mappedData[mappedData.length - 1]);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.siemens.siemens_mri);

    await db.any(query);

    // Update alert.offline_hhm_conn table with host_datetime
    const resent_host_datetime =
      mappedData[mappedData.length - 1].host_datetime;

    const upsert_str = build_upsert_str(System.sme, resent_host_datetime);

    await db.any(upsert_str);

    // ** End Persist

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await System.addLogEvent(
      System.I,
      System.run_log,
      "win10_siemens_mri",
      System.det,
      note,
      null
    );

    // Update Redis Cache

    await System.update_redis_line(first_line);

    return true;
  } catch (error) {
    console.log(error);
    await System.addLogEvent(
      System.E,
      System.run_log,
      "win10_siemens_mri",
      System.det,
      note,
      error
    );
  }
};

module.exports = win10_siemens_mri;
