("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function phil_mri_logcurrent(fileToParse, System) {
  const parsers = fileToParse.logcurrent.parsers;
  const data = [];

  try {
    await log(
      "info",
      System.jobId,
      System.sme,
      "phil_mri_logcurrent",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    await System.getFileData();

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    let line_number = 1;
    for await (const line of System.file_data) {
      let matches = line.match(philips_re[parsers[0]]);

      // Account for lines that are blank (\n)
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          line_number++;
          continue;
        } else {
          await log(
            "error",
            System.jobId,
            System.sme,
            "Not_New_Line",
            "FN CALL",
            {
              message: "This is not a blank or new line - Bad Match",
              line,
              line_number,
            }
          );
          line_number++;
        }
      } else {
        line_number++;
        matches.groups.system_id = System.sme;
        const dtObject = await generateDateTime(
          System.jobId,
          matches.groups.system_id,
          System.fileToParse.logcurrent.pg_table,
          matches.groups.host_date,
          matches.groups.host_time
        );

        // Matches astray data no related to anything. Skip this iteration
        if (
          !!matches.groups.reconstructor ||
          !!matches.groups.data_created_value ||
          !!matches.groups.packets_created ||
          !!matches.groups.size_copy_value
        ) {
          continue;
        }

        if (dtObject === null) {
          await log("warn", System.jobId, System.sme, "date_time", "FN CALL", {
            message: "date_time object null",
            date: matches.groups.host_date,
            time: matches.groups.host_time,
            line,
          });
        }

        matches.groups.host_datetime = dtObject;

        data.push(matches.groups);
      }
    }

    // Homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, phil_mri_logcurrent_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    // ** End Parse

    // ** Begin Persist

    const insertSuccess = await bulkInsert(
      System.jobId,
      dataToArray,
      System.sysConfigData,
      System.fileToParse.logcurrent
    );

    // ** End Persist

    // Update Redis Cache

    if (insertSuccess) {
      await System.updateRedisFileSize();
    }
  } catch (error) {
    console.log(error);
    await log(
      "error",
      System.jobId,
      System.sme,
      "phil_mri_logcurrent",
      "FN CALL",
      {
        error: error,
      }
    );
  }
}

module.exports = phil_mri_logcurrent;
