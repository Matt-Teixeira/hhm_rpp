("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_logcurrent_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

async function phil_mri_logcurrent(fileToParse, System, run_log, job_id) {
  const parsers = fileToParse.logcurrent.parsers;
  const data = [];

  let note = {
    job_id,
    sme: System.sme,
    file: fileToParse,
  };

  try {
    await addLogEvent(I, run_log, "phil_mri_logcurrent", cal, note, null);

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
          let note = {
            job_id,
            sme: System.sme,
            file: fileToParse,
            message: "This is not a blank or new line - Bad Match",
            line,
            line_number,
          };
          await addLogEvent(I, run_log, "phil_mri_logcurrent", cal, note, null);
          line_number++;
        }
      } else {
        line_number++;
        matches.groups.system_id = System.sme;
        const dtObject = await generateDateTime(
          job_id,
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
          !!matches.groups.size_copy_value ||
          !!matches.groups.magnet_meu
        ) {
          continue;
        }

        // magnet_meu group does not have datetime. Ex: '0114,2022,04,01,00,06,08,17,14,00000,'
        if (dtObject === null) {
          let note = {
            job_id,
            sme: System.sme,
            file: fileToParse,
            line,
            match_group: matches.groups,
            message: "date_time object null",
          };
          await addLogEvent(W, run_log, "phil_mri_logcurrent", det, note, null);
          await log("warn", job_id, System.sme, "date_time", "FN CALL", {
            message: "date_time object null",
            date: matches.groups.host_date,
            time: matches.groups.host_time,
            line,
            line_number,
          });
        }

        matches.groups.host_datetime = dtObject;

        data.push(matches.groups);
      }
    }

    // Homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, phil_mri_logcurrent_schema);
    const logcurrent_si = [];
    const logcurrent = [];
    for (let data of mappedData) {
      if (data.event_type === "S" || data.event_type === "I") {
        logcurrent_si.push(data);
      } else {
        logcurrent.push(data);
      }
    }

    const dataToArray_si = logcurrent_si.map(({ ...rest }) =>
      Object.values(rest)
    );
    const dataToArray = logcurrent.map(({ ...rest }) => Object.values(rest));

    // ** End Parse

    // ** Begin Persist

    const insertSuccess = await bulkInsert(
      job_id,
      dataToArray,
      System.sysConfigData,
      System.fileToParse.logcurrent,
      run_log
    );

    console.log("Firest insert success")

    System.fileToParse.logcurrent.query += '_si'

    const insertSuccess_si = await bulkInsert(
      job_id,
      dataToArray_si,
      System.sysConfigData,
      System.fileToParse.logcurrent,
      run_log
    );

    // ** End Persist

    // Update Redis Cache

    if (insertSuccess && insertSuccess_si) {
      await System.updateRedisFileSize();
    }
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "phil_mri_logcurrent", cat, note, error);
    await log("error", job_id, System.sme, "phil_mri_logcurrent", "FN CALL", {
      error: error,
    });
  }
}

module.exports = phil_mri_logcurrent;
