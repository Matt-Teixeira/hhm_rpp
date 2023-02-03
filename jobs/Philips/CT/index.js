("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_ct_eal = require("./eal_parser");
const phil_ct_events = require("./events_parser");

const philips_ct_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "philips_ct_parsers", "FN CALL", {
      sysConfigData,
    });

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "events":
          await phil_ct_events(jobId, sysConfigData, file);
          break;
        case "eal":
          await phil_ct_eal(jobId, sysConfigData, file);
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
