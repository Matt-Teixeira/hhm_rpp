("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");
const GE_CT_MRI = require("../../../data_acquisition/GE_CT_MRI");
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog,
] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("../../../utils/logger/enums");

const ge_ct_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
  };
  try {
    await addLogEvent(I, run_log, "ge_ct_parsers", cal, note, null);
    await log("info", job_id, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "gesys":
          const system = new GE_CT_MRI(sysConfigData, file, job_id);
          await ge_ct_gesys(system, run_log, job_id);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await addLogEvent(E, run_log, "ge_ct_parsers", cat, note, error);
    await log("error", job_id, "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_ct_parsers;
