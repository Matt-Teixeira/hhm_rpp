("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const exec_events_delta = require("../../../read/exec-events_delta");
const exec_events_delta_v2 = require("../../../read/exec-events_delta_v2");
const {
  getRedisLine,
  updateRedisLine,
  updateRedisLinePositions,
  getRedisLinePositions,
} = require("../../../redis/redisHelpers");
const execLastEventsLine = require("../../../read/exec-events_last_parsed_line");

async function phil_ct_events(jobId, sysConfigData, fileToParse) {
  const parsers = fileToParse.parsers;
  const sme = sysConfigData.id;
  const data = [];

  const events_delta_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/events_delta.sh";
  const events_delta_v2_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/events_delta_v2.sh";
  const events_info_parsed_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_last_parsed_events_line.sh";

  try {
    await log("info", jobId, sme, "phil_ct_events", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // Current line number of last line parsed in EALInfo block
    const prev_line_positions = await getRedisLinePositions(
      sysConfigData.id,
      fileToParse.query
    );


    console.log(prev_line_positions)

    // {eal: 4934, events: 11639}

    const events_delta = await exec_events_delta_v2(
      jobId,
      sysConfigData.id,
      events_delta_v2_path,
      [complete_file_path, prev_line_positions.eal, prev_line_positions.events]
    );

    console.log(events_delta);

    if (events_delta === false) {
      await log("warn", jobId, sme, "phil_ct_events", "FN CALL", {
        message: "Line delta indicates no new data or file is empty",
        file: complete_file_path,
      });
      return;
    }

    const events_block_groups = events_delta.file_data.matchAll(
      philips_re[parsers[0]]
    );

    for (let match of events_block_groups) {
      // non-utf8 characters existing in ERROR_BLOB entries
      if (match.groups.type === "ERROR_BLOB") {
        let na_reduced = match.groups.na.match(/(?<na>\w+)/);
        if (na_reduced) {
          match.groups.na = na_reduced.groups.na;
        }

        // console.log(match.groups);
        let blob_reduced = match.groups.blob.match(/(?<blob>\w+)/);
        if (blob_reduced) {
          match.groups.blob = blob_reduced.groups.blob;
        }
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

    console.log(data);

    const mappedData = mapDataToSchema(data, philips_ct_events_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );

    if (insertSuccess) {
      await updateRedisLinePositions(
        sysConfigData.id,
        fileToParse.query,
        events_delta.new_eal_end_line_num,
        events_delta.new_events_line_count
      );
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_events", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_events;
