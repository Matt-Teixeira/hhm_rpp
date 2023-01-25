("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("fs");
const readline = require("readline");
const { win_10_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");
const execHead = require("../../../read/exec-head");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const parse_win_10 = async (jobId, sysConfigData, fileConfig) => {
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const headPath = "./read/sh/head.sh";

  const data = [];

  let line_num = 1;
  try {
    await log("info", jobId, sme, "parse_win_10", "FN CALL");

    const complete_file_path = `${dirPath}/${fileConfig.file_name}`;

    const prevFileSize = await getRedisFileSize(sme, fileConfig.file_name);
    console.log(sme);
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
        fileConfig.file_name
      );
      console.log("CURRENT FILE SIZE: " + currentFileSize);

      const delta = currentFileSize - prevFileSize;
      await log("info", jobId, sme, "delta", "FN CALL", { delta: delta });
      console.log("DELTA: " + delta);

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execHead(headPath, delta, complete_file_path);

      rl = tailDelta.toString().split(/(?:\r\n|\r|\n)/g);
    }

    for await (const line of rl) {
      let matches = line.match(win_10_re.re_v1);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, sme, "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line: line,
          });
        }
      }

      matches.groups.system_id = sme;

      const dtObject = await generateDateTime(
        jobId,
        matches.groups.system_id,
        fileConfig.pg_table,
        matches.groups.host_date,
        matches.groups.host_time
      );

      if (dtObject === null) {
        await log("warn", jobId, sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);
      line_num++;
    }

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileConfig
    );
    if (insertSuccess) {
      await updateRedisFileSize(
        sme,
        updateSizePath,
        sysConfigData.hhm_config.file_path,
        fileConfig.file_name
      );
    }

    return true;
  } catch (error) {
    await log("error", jobId, sme, "parse_win_10", "FN CATCH", {
      line: line_num,
      error: error,
      file: fileConfig,
    });
  }
};

module.exports = parse_win_10;
// /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_col_1>(.*?)(\.\d\.\d)?)\t?\s?(?<host_col_2>(\d{1,5}))\t(?<host_info>.*)/;
