("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_events_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const {
  getRedisFileSize,
  getCurrentFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");

const execTail = require("../../../read/exec-tail");

async function phil_ct_events(jobId, sysConfigData, fileToParse) {
  const parsers = fileToParse.parsers;
  const sme = sysConfigData.id;
  const data = [];

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const tailPath = "./read/sh/tail.sh";

  try {
    await log("info", jobId, sme, "phil_ct_events", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // ** Start Data Acquisition

    // File size from last parse job. Stored in redis.
    const prev_file_size = await getRedisFileSize(
      sysConfigData.id,
      fileToParse.file_name
    );

    console.log("EALInfo - Previous File Size: " + prev_file_size);

    const current_file_size = await getCurrentFileSize(
      sme,
      fileSizePath,
      sysConfigData.hhm_config.file_path,
      fileToParse.file_name
    );

    console.log("EALInfo - Current File Size: " + current_file_size);

    // Break out of function if no file found
    if (current_file_size === null) {
      await log("warn", "NA", sme, "ge_ct_gesys", "FN CALL", {
        message: "File not found in dir",
      });
      return;
    }

    const delta = current_file_size - prev_file_size;

    console.log("EALInfo - Delta: " + delta);

    // Conditionaly set fileData based on what's stored in redis or delta signed integer.
    // If prev_file_size is null, system not in redis and likely not ran before.
    // If prev_file_size is 0, log rotation set redis cache to 0.
    // If delta is less than 0 (negitive number) file got smaller: i.e. log rotated without redis set to 0. Happens on system's end.
    let fileData;
    if (prev_file_size === null || prev_file_size === 0 || delta < 0) {
      console.log("This needs to be read from file");
      fileData = (await fs.readFile(complete_file_path)).toString();
    }

    if (prev_file_size > 0) {
      await log("info", jobId, sme, "delta", "FN CALL", { delta: delta });

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execTail(tailPath, delta, complete_file_path);

      fileData = tailDelta.toString();
    }

    // ** End Data Acquisition

    // ** Start rpp

    const events_block = fileData.matchAll(philips_re[parsers[0]]);

    for await (const match of events_block) {
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
      console.log("SUCCESSFUL INSERT");
      await updateRedisFileSize(
        sme,
        updateSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
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
