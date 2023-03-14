const { log } = require("../../../logger");
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_ct_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const extract = require("../../../processing/date_processing/ge_ct/extract_metadata");

async function ge_ct_gesys(system) {
  // an array in each parser accossiated with a file
  const parsers = system.fileToParse.parsers;
  const data = [];
  const extraction_data = [];

  const tube_test_re = /tube usage data reports/;

  try {
    await log("info", system.jobId, system.sme, "ge_ct_gesys", "FN CALL");

    // ** Start Data Acquisition

    await system.getRedisFileSize();

    await system.getCurrentFileSize();

    await system.getFileData();

    if (system.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    let matches = system.file_data.match(ge_re.ct.gesys[parsers[0]]);

    for await (let match of matches) {
      const matchGroups = match.match(ge_re.ct.gesys[parsers[1]]);

      // matchGroups will be null if no match
      if (!matchGroups) {
        await log("error", system.sme, "ge_ct_gesys", "FN CALL", {
          message: "Failed match",
          prev_epoch: data[data.length - 1].epoch,
          sr_group: data[data.length - 1].sr,
        });
        continue;
      }

      matchGroups.groups.host_date = `${
        matchGroups.groups.day.length === 1
          ? 0 + matchGroups.groups.day
          : matchGroups.groups.day
      }-${matchGroups.groups.month}-${matchGroups.groups.year}`;
      matchGroups.groups.system_id = system.sysConfigData.id;

      const dtObject = await generateDateTime(
        system.jobId,
        matchGroups.groups.system_id,
        system.fileToParse.pg_table,
        matchGroups.groups.host_date,
        matchGroups.groups.host_time
      );

      if (dtObject === null) {
        await log("warn", system.jobId, system.sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      matchGroups.groups.host_datetime = dtObject;

      data.push(matchGroups.groups);

      // Testing here because every group has a value in message property.
      const is_tube_data = tube_test_re.test(matchGroups.groups.message);
      if (is_tube_data) {
        extraction_data.push({
          system_id: matchGroups.groups.system_id,
          message: matchGroups.groups.message,
          host_datetime: matchGroups.groups.host_datetime,
        });
      }
    }

    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    // ** End Parse

    // ** Begin Persist

    const insertSuccess = await bulkInsert(
      system.jobId,
      dataToArray,
      system.sysConfigData,
      system.fileToParse
    );

    // ** End Persist

    // Update Redis Cache

    if (insertSuccess) {
      await system.updateRedisFileSize();
      await extract(system.jobId, extraction_data);
    }
  } catch (error) {
    await log("error", system.jobId, system.sme, "ge_ct_gesys", "FN CALL", {
      error: error.message,
    });
  }
}

module.exports = ge_ct_gesys;
