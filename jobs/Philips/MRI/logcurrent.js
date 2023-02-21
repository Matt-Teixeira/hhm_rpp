("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function phil_mri_logcurrent(fileToParse, System_Logcurrent) {
  const parsers = fileToParse.logcurrent.parsers;
  const data = [];

  try {
    await log(
      "info",
      System_Logcurrent.jobId,
      System_Logcurrent.sme,
      "phil_mri_logcurrent",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System_Logcurrent.getRedisFileSize();

    await System_Logcurrent.getCurrentFileSize();

    await System_Logcurrent.getFileData();

    if (System_Logcurrent.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    for await (const line of System_Logcurrent.file_data) {
      let matches = line.match(philips_re[parsers[0]]);

      // Account for lines that are blank (\n)
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log(
            "error",
            System_Logcurrent.jobId,
            System_Logcurrent.sme,
            "Not_New_Line",
            "FN CALL",
            {
              message: "This is not a blank or new line - Bad Match",
              line,
            }
          );
        }
      } else {
        matches.groups.system_id = System_Logcurrent.sme;
        const dtObject = await generateDateTime(
          System_Logcurrent.jobId,
          matches.groups.system_id,
          System_Logcurrent.fileToParse.logcurrent.pg_table,
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
          await log(
            "warn",
            System_Logcurrent.jobId,
            System_Logcurrent.sme,
            "date_time",
            "FN CALL",
            {
              message: "date_time object null",
              date: matches.groups.host_date,
              time: matches.groups.host_time,
              line
            }
          );
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
      System_Logcurrent.jobId,
      dataToArray,
      System_Logcurrent.sysConfigData,
      System_Logcurrent.fileToParse.logcurrent
    );

    // ** End Persist

    // Update Redis Cache

    if (insertSuccess) {
      await System_Logcurrent.updateRedisFileSize();
    }
  } catch (error) {
    console.log(error);
    await log(
      "error",
      System_Logcurrent.jobId,
      System_Logcurrent.sme,
      "phil_mri_logcurrent",
      "FN CALL",
      {
        error: error,
      }
    );
  }
}

module.exports = phil_mri_logcurrent;
