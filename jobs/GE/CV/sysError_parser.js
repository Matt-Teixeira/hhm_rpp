const { log } = require("../../../logger");
const { ge_re } = require("../../../parse/parsers");
const { ge_cv_syserror_schema } = require("../../../persist/pg-schemas");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const { remove_dub_quotes } = require("../../../utils/regExHelpers");

// File to parse is read line by line for regEx to match
async function ge_cv_sys_error(System) {
  // an array in each config accossiated with a file
  const parsers = System.fileToParse.parsers;
  const data = [];

  try {
    await log(
      "info",
      System.jobId,
      System.sysConfigData.id,
      "ge_cv_sys_error",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    await System.getFileData();

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    for await (const line of System.file_data) {
      let matches = line.match(ge_re.cv[parsers[0]]);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log(
            "error",
            System.jobId,
            System.sysConfigData.id,
            "Not_New_Line",
            "FN CALL",
            {
              message: "This is not a blank new line - Bad Match",
              line: line,
            }
          );
        }
      } else {
        matches.groups.system_id = System.sysConfigData.id;

        // Remove colen ":" from millisecond delimiter and change to period "."
        let splitColens = matches.groups.host_time.split(":");
        matches.groups.host_time = `${splitColens[0]}:${splitColens[1]}:${splitColens[2]}.${splitColens[3]}`;
        const dtObject = await generateDateTime(
          System.jobId,
          matches.groups.system_id,
          System.fileToParse.pg_table,
          matches.groups.host_date,
          matches.groups.host_time
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

        matches.groups.host_datetime = dtObject;

        // Remove double quotes from str
        if (matches.groups.subsystem !== "") {
          remove_dub_quotes(matches, "subsystem");
        }

        data.push(matches.groups);
      }
    }

    // Remove headers - head of array
    data.shift();

    const mappedData = mapDataToSchema(data, ge_cv_syserror_schema);
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
      "ge_cv_sys_error",
      "FN CALL",
      {
        error: error,
      }
    );
  }
}

module.exports = ge_cv_sys_error;
