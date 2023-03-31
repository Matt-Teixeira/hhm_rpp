("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { win_10_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const execLastMod = require("../../../read/exec-file_last_mod");
const extract = require("../../../processing/date_processing/siemens_ct/extract_metadata");

/*
NOTE ON EvtApplication_Today.txt
This file turns over on a 24 hour intervolve; however, it also accumulates data throughout the day.
New data is added to file head. 
*/

const win10_siemens_ct = async (System) => {
  const data = [];
  const extracted_metadata = [];

  lastModPath = "./read/sh/get_file_last_mod.sh";

  let line_num = 1;
  // first_line will be the most recent line data
  let first_line;

  try {
    await log("info", System.jobId, System.sme, "win10_siemens_ct", "FN CALL");

    await System.get_redis_line();

    // Returns true if file in dir.
    if (!System.is_file_present()) return;

    System.get_file_data();

    for await (const line of System.file_data) {
      // Save first line (most resent parsed line) to redis
      // This process of delimiting new and old data only works because new data is appended to top
      if (line_num === 1) first_line = line;

      // If line (in file) === redis_line, we break because we have reached point of last rpp.
      if (line == System.redis_line) {
        // Log file's last mod datetime
        const file_mod_datetime = await execLastMod(lastModPath, [
          System.complete_file_path,
        ]);
        await log("warn", System.jobId, System.sme, "getFileData", "FN CALL", {
          message: `End of new data`,
          lines: line_num - 1,
          last_mod: file_mod_datetime,
        });
        break;
      }

      let matches = line.match(win_10_re[System.parsers[0]]);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log(
            "error",
            System.jobId,
            System.sme,
            "Not_New_Line",
            "FN CALL",
            {
              message: "This is not a blank new line - Bad Match",
              line: line,
            }
          );
        }
      }

      matches.groups.system_id = System.sme;

      const dtObject = await generateDateTime(
        System.jobId,
        matches.groups.system_id,
        System.fileToParse.pg_table,
        matches.groups.host_date,
        matches.groups.host_time
      );

      if (dtObject === null) {
        await log("warn", System.jobId, System.sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);

      const scan_sec_test_re = /scan\sseconds/;
      if (scan_sec_test_re.test(matches.groups.text_group)) {
        extracted_metadata.push({
          system_id: matches.groups.system_id,
          text_group: matches.groups.text_group,
          host_datetime: matches.groups.host_datetime,
        });
      }

      line_num++;
    }

    // No data in array if most recently parsed line in redis === first line in file. Indication of no change in file.
    // Logged above
    if (data.length === 0) return;

    const mappedData = mapDataToSchema(data, siemens_ct_mri);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      System.jobId,
      dataToArray,
      System.sysConfigData,
      System.fileToParse
    );
    if (insertSuccess) {
      await System.update_redis_line(first_line);
      if (extracted_metadata.length > 0)
        await extract(System.jobId, extracted_metadata);
    }

    return true;
  } catch (error) {
    await log(
      "error",
      System.jobId,
      System.sme,
      "win10_siemens_ct",
      "FN CATCH",
      {
        line: line_num,
        error: error,
      }
    );
  }
};

module.exports = win10_siemens_ct;
