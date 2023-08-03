const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { ge_re } = require("../../../parse/parsers");
const { ge_cv_syserror_schema } = require("../../../persist/pg-schemas");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const { remove_dub_quotes } = require("../../../util/regExHelpers");
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
    await System.addLogEvent(
      System.I,
      System.run_log,
      "ge_cv_sys_error",
      System.cal,
      note,
      null
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    await System.getFileData("read_stream");
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
          await System.addLogEvent(
            System.W,
            System.run_log,
            "ge_cv_sys_error",
            System.det,
            note,
            null
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
          await System.addLogEvent(
            System.W,
            System.run_log,
            "ge_cv_sys_error",
            System.det,
            note,
            null
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

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await System.addLogEvent(
      System.I,
      System.run_log,
      "ge_cv_sys_error",
      System.det,
      note,
      null
    );

    // ** End Persist

    // Update Redis Cache

    await System.updateRedisFileSize();
  } catch (error) {
    console.log(error);
    let note = {
      job_id: System.job_id,
      sme: System.sysConfigData.id,
    };
    await System.addLogEvent(
      System.E,
      System.run_log,
      "ge_cv_sys_error",
      System.cat,
      note,
      error
    );
  }
}

module.exports = ge_cv_sys_error;
