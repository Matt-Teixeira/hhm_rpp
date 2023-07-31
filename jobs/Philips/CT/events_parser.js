const { log } = require("../../../logger");
const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

async function phil_ct_events(System) {
  const data = [];

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.fileToParse.file_name,
  };

  try {
    await addLogEvent(I, System.run_log, "phil_ct_events", cal, note, null);
    await log(
      "info",
      System.job_id,
      System.sysConfigData.id,
      "phil_ct_events",
      "FN CALL"
    );

    // ** Start Data Acquisition
    await System.getRedisFileSize();
    await System.getCurrentFileSize();
    System.getFileSizeDelta();

    // Break out of function if no file found
    if (System.current_file_size === null) {
      note.message = "File not found in dir";
      await addLogEvent(I, System.run_log, "phil_ct_events", det, note, null);
      await log(
        "warn",
        System.job_id,
        System.sme,
        "phil_ct_events",
        "FN CALL",
        {
          message: "File not found in dir",
        }
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
        await addLogEvent(W, System.run_log, "phil_ct_events", det, note, null);
        await log("warn", System.job_id, System.sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_events_schema);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(
      mappedData,
      pg_cs.log.philips.philips_ct_events
    );

    await db.any(query);

    // ** End Persist

    // Update Redis Cache

    await System.updateRedisFileSize();
  } catch (error) {
    await addLogEvent(E, System.run_log, "phil_ct_events", cat, note, error);
    await log(
      "error",
      System.job_id,
      System.sysConfigData.id,
      "phil_ct_events",
      "FN CALL",
      {
        error,
      }
    );
  }
}

module.exports = phil_ct_events;
