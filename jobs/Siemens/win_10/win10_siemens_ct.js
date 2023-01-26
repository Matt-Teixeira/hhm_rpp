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
  updateRedisLine,
  getRedisLine,
} = require("../../../redis/redisHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const win10_siemens_ct = async (jobId, sysConfigData, fileConfig) => {
  const sme = sysConfigData.id;
  const dirPath = sysConfigData.hhm_config.file_path;

  const data = [];

  let line_num = 1;
  // first_line will be the most recent line data
  let first_line;
  try {
    await log("info", jobId, sme, "win10_siemens_ct", "FN CALL");

    let redis_line = await getRedisLine(sme, fileConfig.file_name);

    const complete_file_path = `${dirPath}/${fileConfig.file_name}`;

    rl = readline.createInterface({
      input: fs.createReadStream(complete_file_path),
      crlfDelay: Infinity,
    });

    for await (const line of rl) {
      // Save first line (most up to date data entry) to redis
      // This process of delimiting new and old data only works because new data is appended to top of
      if (line_num === 1) first_line = line;

      // If line (in file) === redis_line, we break because we have reached point of last rpp.
      if (line == redis_line) {
        console.log("FOUND END OF LINE" + "\n");
        console.log(line + "\n");
        console.log(redis_line + "\n");
        break;
      }

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

    // No data in array if most recently parsed line in redis === first line in file. Indication of no change in file.
    if (data.length === 0) {
      await log("warn", jobId, sme, "win10_siemens_ct", "FN CALL", {
        message: "No new data in file",
        file: fileConfig.file_name,
      });
      return;
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
      await updateRedisLine(sme, fileConfig.file_name, first_line);
    }

    return true;
  } catch (error) {
    await log("error", jobId, sme, "win10_siemens_ct", "FN CATCH", {
      line: line_num,
      error: error,
      file: fileConfig,
    });
  }
};

module.exports = win10_siemens_ct;

// "I\t2023-01-26\t11:14:43\tCT_PRF\t4\tFree Resources: DB: Local 2827 MB Exchangeboard 758 MB PixelPartition[store]: 86612 MB PixelPartition[scan]: 88745 MB PixelPartition[stamp]: 121064 MB IPT partition: 25675 MB phys MEM: 4095 MB"
// "I       2023-01-26      11:44:49        CT_PRF  4       Free Resources: DB: Local 2826 MB Exchangeboard 758 MB PixelPartition[store]: 85692 MB PixelPartition[scan]: 87728 MB PixelPartition[stamp]: 121062 MB IPT partition: 25674 MB phys MEM: 4095 MB"
