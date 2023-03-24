("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_ct_eal = require("./eal_parser");
const phil_ct_events = require("./events_parser");
const { Philips_CT } = require("../../../data_acquisition/Philips_CT");

const philips_ct_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, sysConfigData.id, "philips_ct_parsers", "FN CALL", {
      sysConfigData,
    });

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "eal":
          const eal_system = new Philips_CT(sysConfigData, file, jobId);
          await phil_ct_eal(eal_system);
          break;
        case "events":
          const events_system = new Philips_CT(sysConfigData, file, jobId);
          await phil_ct_events(events_system);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await log("error", jobId, sysConfigData.id, "philips_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philips_ct_parsers;
