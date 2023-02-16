("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs");
const readline = require("readline");
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const { convertDates } = require("../../../utils/dates");
const constructFilePath = require("../../../utils/constructFilePath");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");
const execTail = require("../../../read/exec-tail");

async function phil_mri_logcurrent(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const tailPath = "./read/sh/tail.sh";

  const data = [];

  try {
    await log("info", jobId, sme, "phil_mri_logcurrent", "FN CALL");

    const complete_file_path = await constructFilePath(
      sysConfigData.hhm_config.file_path,
      fileToParse,
      fileToParse.regEx
    );

    const prevFileSize = await getRedisFileSize(sme, fileToParse.file_name);
    console.log("Redis File Size: " + prevFileSize);

    let rl;
    if (prevFileSize === null) {
      console.log("This needs to be read from file");
      rl = readline.createInterface({
        input: fs.createReadStream(complete_file_path),
        crlfDelay: Infinity,
      });
    }

    if (prevFileSize > 0 && prevFileSize !== null) {
      console.log("File Size prev saved in Redis");

      const currentFileSize = await getCurrentFileSize(
        sme,
        fileSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
      console.log("CURRENT FILE SIZE: " + currentFileSize);

      const delta = currentFileSize - prevFileSize;
      await log("info", jobId, sme, "delta", "FN CALL", { delta: delta });
      console.log("DELTA: " + delta);

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execTail(tailPath, delta, complete_file_path);

      rl = tailDelta.toString().split(/(?:\r\n|\r|\n)/g);
      console.log(rl);
    }

    for await (const line of rl) {
      let matches = line.match(philips_re.mri_logcurrent);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, sme, "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line,
          });
        }
      } else {
        convertDates(matches.groups, dateTimeVersion);
        const matchData = groupsToArrayObj(sme, matches.groups);
        data.push(matchData);
      }
    }

    // homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, phil_mri_logcurrent_schema);
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
    await log("error", jobId, sme, "phil_mri_logcurrent", "FN CALL", {
      sme: sme,
      error: error.message,
    });
  }
}

module.exports = phil_mri_logcurrent;
