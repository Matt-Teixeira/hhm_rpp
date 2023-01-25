("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const phil_ct_eal = require("./eal_parser");
const phil_ct_events = require("./events_parser");

async function philipsLogger(jobId, sysConfigData, fileToParse) {
  try {
    await log("info", jobId, sysConfigData.id, "philipsLogger", "FN CALL");

    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    const ct_eal_events_blocks = fileData.match(
      philips_re.ct_eal_events_blocks
    );

    await phil_ct_eal(
      jobId,
      sysConfigData,
      fileToParse,
      ct_eal_events_blocks.groups.eal_info_block
    );

    await phil_ct_events(
      jobId,
      sysConfigData,
      fileToParse,
      ct_eal_events_blocks.groups.events_block
    );
  } catch (error) {
    console.log(error);
    await log("error", jobId, sysConfigData.id, "philipsLogger", "FN CALL", {
      error,
    });
  }
}

module.exports = philipsLogger;
