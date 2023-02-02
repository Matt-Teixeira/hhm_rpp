("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const exec_events_delta = require("../../../read/exec-events_delta");
const {
  getRedisLine,
  updateRedisLine,
} = require("../../../redis/redisHelpers");
const execLastEventsLine = require("../../../read/exec-events_last_parsed_line");

async function phil_ct_events(jobId, sysConfigData, fileToParse) {
  const parsers = fileToParse.parsers;
  const sme = sysConfigData.id;
  const data = [];

  const events_delta_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/events_delta.sh";
  const events_info_parsed_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_last_parsed_events_line.sh";

  try {
    await log("info", jobId, sme, "phil_ct_events", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // Current line number of last line parsed in EALInfo block
    const last_parsed_line = await getRedisLine(
      sysConfigData.id,
      fileToParse.query
    );

    const events_delta = await exec_events_delta(
      jobId,
      sysConfigData.id,
      events_delta_path,
      [complete_file_path, last_parsed_line]
    );

    if (events_delta === false) {
      await log("warn", jobId, sme, "phil_ct_events", "FN CALL", {
        message: "Line delta indicates no new data or file is empty",
        file: complete_file_path,
      });
      return;
    }
    const events_block_groups = events_delta.matchAll(philips_re[parsers[0]]);

    for (let match of events_block_groups) {
      // non-utf8 characters existing in ERROR_BLOB entries
      if (match.groups.type === "ERROR_BLOB") {
        let na_reduced = match.groups.na.match(/(?<na>\w+)/);
        if (na_reduced) {
          match.groups.na = na_reduced.groups.na;
        }

        let blob_reduced = match.groups.blob.match(/(?<blob>\w+)/);
        match.groups.blob = blob_reduced.groups.blob;
      }
      match.groups.system_id = sme;

      const dtObject = await generateDateTime(
        jobId,
        match.groups.system_id,
        fileToParse.pg_table,
        match.groups.host_date,
        match.groups.host_time
      );

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_events_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );

    if (insertSuccess) {
      const last_line = await execLastEventsLine(events_info_parsed_line_path, [
        complete_file_path,
      ]);

      // Using .query value instead of file name due to conflict in same sme and file name format. Ex: "SME07847.Logger.output" for both data sets
      await updateRedisLine(sme, fileToParse.query, last_line);
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_events", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_events;
