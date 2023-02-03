("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_eal_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

const exec_eal_delta = require("../../../read/exec-eal_delta");
const exec_last_parsed_line = require("../../../read/exec-last_parsed_line");
const { getRedisLine, updateRedisLine } = require("../../../redis/redisHelpers");

async function phil_ct_eal(jobId, sysConfigData, fileToParse) {
  const parsers = fileToParse.parsers
  const sme = sysConfigData.id;
  const data = [];

  const eal_delta_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/eal_delta.sh";
  const eal_info_parsed_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_last_parsed_eal_line.sh";

  try {
    await log("info", jobId, sme, "phil_ct_eal", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    //

    // Current line number of last line parsed in EALInfo block
    const last_parsed_line = await getRedisLine(
      sysConfigData.id,
      fileToParse.query
    );

    console.log(last_parsed_line);

    // Current line number of end of EALInfo block
    const eal_delta = await exec_eal_delta(
      jobId,
      sysConfigData.id,
      eal_delta_path,
      [complete_file_path, last_parsed_line]
    );

    if(eal_delta === false) {
      await log("warn", jobId, sme, "phil_ct_eal", "FN CALL", {
        message: "Line delta indicates no new data or file is empty",
        file: complete_file_path
      });
      return
    }

    //

    const eal_block_groups = eal_delta.matchAll(philips_re[parsers[0]]);

    for (let match of eal_block_groups) {
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
      console.log(match.groups)
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
      const last_line = await exec_last_parsed_line(eal_info_parsed_line_path, [
        complete_file_path,
      ]);
      console.log(last_line);

      // Using .query value instead of file name due to conflict in same sme and file name format. Ex: "SME07847.Logger.output" for both data sets
      await updateRedisLine(sme, fileToParse.query, last_line);
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_eal", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_eal;
