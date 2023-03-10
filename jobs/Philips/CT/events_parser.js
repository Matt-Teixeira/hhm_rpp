("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function phil_ct_events(system) {
  const data = [];

  try {
    await log(
      "info",
      system.jobId,
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
      await log("warn", system.jobId, system.sme, "phil_ct_events", "FN CALL", {
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
        system.jobId,
        match.groups.system_id,
        system.fileToParse.pg_table,
        match.groups.host_date,
        match.groups.host_time
      );

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_events_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      system.jobId,
      dataToArray,
      system.sysConfigData,
      system.fileToParse
    );

    if (insertSuccess) {
      console.log("SUCCESSFUL INSERT");
      await system.updateRedisFileSize();
    }
  } catch (error) {
    console.log(error);
    await log(
      "error",
      system.jobId,
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
