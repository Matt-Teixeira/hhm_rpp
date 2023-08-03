const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_eal_schema } = require("../../../persist/pg-schemas");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const { remove_dub_quotes } = require("../../../util/regExHelpers");
const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

async function phil_ct_eal(System) {
  const data = [];

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.fileToParse.file_name,
  };

  try {
    await System.addLogEvent(
      System.I,
      System.run_log,
      "phil_ct_eal",
      System.cal,
      note,
      null
    );

    // ** Start Data Acquisition
    await System.getRedisFileSize();
    await System.getCurrentFileSize();
    System.getFileSizeDelta();

    // Break out of function if no file found
    if (System.current_file_size === null) {
      note.message = "File not found in dir";
      await System.addLogEvent(
        System.I,
        System.run_log,
        "phil_ct_eal",
        System.cal,
        note,
        null
      );
      return;
    }

    await System.getFileData();

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Start rpp

    const matches = System.getMatchBlocks();

    for await (const match of matches) {
      match.groups.system_id = System.sme;
      const dtObject = await generateDateTime(
        System.job_id,
        match.groups.system_id,
        System.fileToParse.pg_table,
        match.groups.host_date,
        match.groups.host_time
      );

      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          match_group: matches.groups,
          message: "date_time object null",
        };
        await System.addLogEvent(
          System.W,
          System.run_log,
          "phil_ct_eal",
          System.det,
          note,
          null
        );
      }

      match.groups.host_datetime = dtObject;

      // Remove double quotes from strings
      if (match.groups.file !== "" || match.groups.err_number) {
        remove_dub_quotes(match, "file");
      }
      if (match.groups.err_number !== "") {
        remove_dub_quotes(match, "err_number");
      }

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(
      mappedData,
      pg_cs.log.philips.philips_ct_eal
    );

    await db.any(query);

    // ** End Persist

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await System.addLogEvent(
      System.I,
      System.run_log,
      "phil_ct_eal",
      System.det,
      note,
      null
    );

    // Update Redis Cache

    await System.updateRedisFileSize();
  } catch (error) {
    await System.addLogEvent(
      System.E,
      System.run_log,
      "phil_ct_eal",
      System.cat,
      note,
      error
    );
  }
}

module.exports = phil_ct_eal;
