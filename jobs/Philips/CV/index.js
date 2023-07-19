("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_cv_eventlog = require("./eventlog");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

const philips_cv_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
    sme: sysConfigData.id
  };
  try {
    await addLogEvent(I, run_log, "philips_ct_parsers", cal, note, null);
    await log("info", job_id, sysConfigData.id, "philips_cv_parsers", "FN CALL");
    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "EventLog":
          await phil_cv_eventlog(job_id, sysConfigData, file, run_log);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await addLogEvent(E, run_log, "philips_cv_parsers", cat, note, error);
    await log("error", job_id, sysConfigData.id, "philips_cv_parsers", "FN CATCH", {
      error: error.message,
    });
  }
};

module.exports = philips_cv_parsers;
