("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_eal_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const execLineNumber = require("../../../read/exec-lineNumber");
const execLastEalLine = require("../../../read/exec-lasteEalLine");
const { getRedisLine } = require("../../../redis/redisHelpers");

async function phil_ct_eal(jobId, sysConfigData, fileToParse) {
  const sme = sysConfigData.id;
  const data = [];

  const eal_info_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_EAL_line.sh";
  const eal_info_parsed_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_last_parsed_eal_line.sh";

  try {
    await log("info", jobId, sme, "phil_ct_eal", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    //

    // Current line number of last line parsed in EALInfo block
    const last_eal_line_redis = await getRedisLine(
      sysConfigData.id,
      fileToParse.query.eal
    );

    // Current line number of end of EALInfo block
    const eal_delta = await execLineNumber(
      jobId,
      sysConfigData.id,
      eal_info_line_path,
      [complete_file_path, last_eal_line_redis]
    );

    const last_line = await execLastEalLine(eal_info_parsed_line_path, [
      complete_file_path,
    ]);
    console.log(last_line);

    //

    const eal_block_groups = eal_delta.matchAll(philips_re.ct_eal_v_2);

    for (let match of eal_block_groups) {
      match.groups.system_id = sme;
      const dtObject = await generateDateTime(
        jobId,
        match.groups.system_id,
        fileToParse.pg_table.eal,
        match.groups.host_date,
        match.groups.host_time
      );

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      // Update redis line
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_eal", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_eal;
