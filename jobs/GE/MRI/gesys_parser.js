const { log } = require("../../../logger");
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_mri_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function ge_mri_gesys(System) {
  // an array in each config accossiated with a file
  const parsers = System.fileToParse.parsers;
  const data = [];

  try {
    await log(
      "info",
      System.jobId,
      System.sysConfigData.id,
      "ge_mri_gesys",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    await System.getFileData();

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    let matches = System.file_data.match(ge_re.mri.gesys[parsers[0]]);

    for await (let match of matches) {
      const matchGroups = match.match(ge_re.mri.gesys[parsers[1]]);
      // matchGroups will be null if no match
      if (!matchGroups) {
        await log(
          "error",
          System.jobId,
          System.sysConfigData.id,
          "ge_mri_gesys",
          "FN CALL",
          {
            message: "Failed match",
            prev_epoch: data[data.length - 1].epoch,
            sr_group: data[data.length - 1].sr,
          }
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
        System.jobId,
        matchGroups.groups.system_id,
        System.fileToParse.pg_table,
        matchGroups.groups.host_date,
        matchGroups.groups.host_time
      );

      if (dtObject === null) {
        await log(
          "warn",
          System.jobId,
          System.sysConfigData.id,
          "date_time",
          "FN CALL",
          {
            message: "date_time object null",
          }
        );
      }

      matchGroups.groups.host_datetime = dtObject;

      data.push(matchGroups.groups);
    }

    const mappedData = mapDataToSchema(data, ge_mri_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    // ** End Parse

    // ** Begin Persist

    const insertSuccess = await bulkInsert(
      System.jobId,
      dataToArray,
      System.sysConfigData,
      System.fileToParse
    );

    // ** End Persist

    // Update Redis Cache

    if (insertSuccess) {
      await System.updateRedisFileSize();
    }
  } catch (error) {
    await log(
      "error",
      System.jobId,
      System.sysConfigData.id,
      "ge_mri_gesys",
      "FN CALL",
      {
        error: error.message,
      }
    );
  }
}

module.exports = ge_mri_gesys;
