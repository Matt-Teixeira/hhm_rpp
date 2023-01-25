("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_cv_eventlog = require("./eventlog");

const philips_cv_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, sysConfigData.id, "philips_cv_parsers", "FN CALL");
    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "EventLog":
          await phil_cv_eventlog(jobId, sysConfigData, file);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await log("error", jobId, sysConfigData.id, "philips_cv_parsers", "FN CATCH", {
      error: error.message,
    });
  }
};

module.exports = philips_cv_parsers;
