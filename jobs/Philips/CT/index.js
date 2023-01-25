("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const eal_info_parser = require("./logger");
const phil_ct_events = require("./events_parser");

const philips_ct_parsers = async (jobId, sysConfigData) => {

  try {
    await log("info", jobId, "NA", "philips_ct_parsers", "FN CALL", {
      sysConfigData,
    });
    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.file_name) {
        case "Logger.output":
          await eal_info_parser(jobId, sysConfigData, file);
          break;
        case "events":
          await phil_ct_events(jobId, sysConfigData);
          break;
        default:
          break;
      }
    }
    
  } catch (error) {
    await log("error", jobId, "NA", "philips_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philips_ct_parsers;
