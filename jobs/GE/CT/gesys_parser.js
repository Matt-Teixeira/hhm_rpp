("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_ct_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");
const execTail = require("../../../read/exec-tail");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

// File to parse is read into string for regEx to match
async function ge_ct_gesys(jobId, sysConfigData, fileToParse) {
  const sme = sysConfigData.id;
  // an array in each config accossiated with a file
  const parsers = fileToParse.parsers;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const tailPath = "./read/sh/tail.sh";

  const data = [];

  try {
    await log("info", jobId, sme, "ge_ct_gesys", "FN CALL");

    // Example: /opt/hhm-files/C0051/SHIP098/SME12444/gesys_GECT1.log
    let complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // File size stored in redis. Size at last pull
    const prevFileSize = await getRedisFileSize(sme, fileToParse.file_name);

    const currentFileSize = await getCurrentFileSize(
      sme,
      fileSizePath,
      sysConfigData.hhm_config.file_path,
      fileToParse.file_name
    );

    const delta = currentFileSize - prevFileSize;

    // Conditionaly set fileData based on what's stored in redis or delta signed integer.
    // If prevFileSize is null, system not in redis and likely not ran before.
    // If prevFileSize is 0, log rotation set redis cache to 0.
    // If delta is less than 0 (negitive number) file got smaller: i.e. log rotated without redis set to 0. Happens on system end.
    let fileData;
    if (prevFileSize === null || prevFileSize === 0 || delta < 0) {
      console.log("This needs to be read from file");
      fileData = (await fs.readFile(complete_file_path)).toString();
    }

    // If there is a file size in redis, pull delta via tail
    if (prevFileSize > 0) {
      // Break out of function if no file found
      if (currentFileSize === null) {
        await log("warn", "NA", sme, "ge_ct_gesys", "FN CALL", {
          message: "File not found in dir",
        });
        return;
      }

      await log("info", jobId, sme, "delta", "FN CALL", { delta: delta });

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execTail(tailPath, delta, complete_file_path);

      fileData = tailDelta.toString();
    }

    // Begin parsing file data
    let matches = fileData.match(ge_re.ct.gesys[parsers[0]]);

    for await (let match of matches) {
      const matchGroups = match.match(ge_re.ct.gesys[parsers[1]]);

      matchGroups.groups.host_date = `${
        matchGroups.groups.day.length === 1
          ? 0 + matchGroups.groups.day
          : matchGroups.groups.day
      }-${matchGroups.groups.month}-${matchGroups.groups.year}`;
      matchGroups.groups.system_id = sme;

      const dtObject = await generateDateTime(
        jobId,
        matchGroups.groups.system_id,
        fileToParse.pg_table,
        matchGroups.groups.host_date,
        matchGroups.groups.host_time
      );

      if (dtObject === null) {
        await log("warn", jobId, sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      matchGroups.groups.host_datetime = dtObject;

      data.push(matchGroups.groups);
    }

    const mappedData = mapDataToSchema(data, ge_ct_gesys_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      await updateRedisFileSize(
        sme,
        updateSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
    }
  } catch (error) {
    await log("error", "NA", sme, "ge_ct_gesys", "FN CALL", {
      error: error,
    });
  }
}

module.exports = ge_ct_gesys;
