const { log } = require("../../../logger");
const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { ge_re } = require("../../../parse/parsers");
const { ge_cv_syserror_schema } = require("../../../persist/pg-schemas");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const { remove_dub_quotes } = require("../../../util/regExHelpers");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

// File to parse is read line by line for regEx to match
async function ge_cv_sys_error(System) {
  // an array in each config accossiated with a file
  const parsers = System.fileToParse.parsers;
  const data = [];

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.fileToParse.file_name,
  };

  try {
    await addLogEvent(I, System.run_log, "ge_cv_sys_error", cal, note, null);
    await log(
      "info",
      System.job_id,
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
          let note = {
            job_id: System.job_id,
            sme: System.sysConfigData.id,
            message: "This is not a blank new line - Bad Match",
            line: line,
          };
          await addLogEvent(
            W,
            System.run_log,
            "ge_cv_sys_error",
            det,
            note,
            null
          );
          await log(
            "error",
            System.job_id,
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
          System.job_id,
          matches.groups.system_id,
          System.fileToParse.pg_table,
          matches.groups.host_date,
          matches.groups.host_time
        );

        if (dtObject === null) {
          let note = {
            job_id: System.job_id,
            sme: System.sme,
            line: line,
            match_group: matches.groups,
            message: "date_time object null",
          };
          await addLogEvent(
            W,
            System.run_log,
            "ge_cv_sys_error",
            det,
            note,
            null
          );
          await log(
            "warn",
            System.job_id,
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

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.ge.ge_cv_syserror);

    await db.any(query);

    // ** End Persist

    // Update Redis Cache

    await System.updateRedisFileSize();
  } catch (error) {
    console.log(error);
    let note = {
      job_id: System.job_id,
      sme: System.sysConfigData.id,
    };
    await addLogEvent(E, System.run_log, "ge_cv_sys_error", cat, note, error);
    await log(
      "error",
      System.job_id,
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
