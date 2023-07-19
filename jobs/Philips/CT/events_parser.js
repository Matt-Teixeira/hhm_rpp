("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

async function phil_ct_events(system, run_log, job_id) {
  const data = [];

  let note = {
    job_id: job_id,
    sme: system.sme,
    file: system.fileToParse.file_name,
  };

  try {
    await addLogEvent(I, run_log, "phil_ct_events", cal, note, null);
    await log(
      "info",
      job_id,
      system.sysConfigData.id,
      "phil_ct_events",
      "FN CALL"
    );

    // ** Start Data Acquisition
    await system.getRedisFileSize();
    await system.getCurrentFileSize();
    system.getFileSizeDelta();

    // Break out of function if no file found
    if (system.current_file_size === null) {
      note.message = "File not found in dir";
      await addLogEvent(I, run_log, "phil_ct_events", det, note, null);
      await log("warn", job_id, system.sme, "phil_ct_events", "FN CALL", {
        message: "File not found in dir",
      });
      return;
    }

    await system.getFileData();

    if (system.file_data === null) return;

    // ** End Data Acquisition

    // ** Start rpp

    const matches = system.getMatchBlocks();

    for await (const match of matches) {
      match.groups.system_id = system.sme;
      const dtObject = await generateDateTime(
        job_id,
        match.groups.system_id,
        system.fileToParse.pg_table,
        match.groups.host_date,
        match.groups.host_time
      );

      if (dtObject === null) {
        let note = {
          job_id: job_id,
          sme: system.sme,
          match_group: matches.groups,
          message: "date_time object null",
        };
        await addLogEvent(W, run_log, "phil_ct_events", det, note, null);
        await log("warn", job_id, system.sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_events_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      job_id,
      dataToArray,
      system.sysConfigData,
      system.fileToParse,
      run_log
    );

    if (insertSuccess) {
      await system.updateRedisFileSize();
    }
  } catch (error) {
    await addLogEvent(E, run_log, "phil_ct_events", cat, note, error);
    await log(
      "error",
      job_id,
      system.sysConfigData.id,
      "phil_ct_events",
      "FN CALL",
      {
        error,
      }
    );
  }
}

module.exports = phil_ct_events;
