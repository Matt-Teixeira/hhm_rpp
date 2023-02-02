("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const phil_ct_eal = require("./eal_parser");
const phil_ct_events = require("./events_parser");

const execLineNumber = require("../../../read/exec-eal_delta");
const execLastEalLine = require("../../../read/exec-last_parsed_line");
const { getRedisLine } = require("../../../redis/redisHelpers");

async function philipsLogger(jobId, sysConfigData, fileToParse) {

  const eal_info_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_EAL_line.sh";
  const eal_info_parsed_line_path =
    "/home/matt-teixeira/hep3/hhm_rpp/read/sh/get_last_parsed_eal_line.sh";

  try {
    await log("info", jobId, sysConfigData.id, "philipsLogger", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    // Current line number of last line parsed in EALInfo block
    const last_eal_line_redis = await getRedisLine(sysConfigData.id, fileToParse.query.eal);
    
    // Current line number of end of EALInfo block
    const eal_delta = await execLineNumber(
      jobId,
      sysConfigData.id,
      eal_info_line_path,
      [complete_file_path, last_eal_line_redis]
    );


    const last_line = await execLastEalLine(eal_info_parsed_line_path, [complete_file_path]);

    console.log(eal_delta === "\n");

   /*  const fileData = (await fs.readFile(complete_file_path)).toString();

    const ct_eal_events_blocks = fileData.match(
      philips_re.ct_eal_events_blocks
    );
 */
    await phil_ct_eal(
      jobId,
      sysConfigData,
      fileToParse,
    );

    /* await phil_ct_events(
      jobId,
      sysConfigData,
      fileToParse,
      ct_eal_events_blocks.groups.events_block
    ); */

  } catch (error) {
    console.log(error);
    await log("error", jobId, sysConfigData.id, "philipsLogger", "FN CALL", {
      error,
    });
  }
}

module.exports = philipsLogger;
