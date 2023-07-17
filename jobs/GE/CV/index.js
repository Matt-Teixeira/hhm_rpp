("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_cv_sysError = require("./sysError_parser");
const GE_CV = require("../../../data_acquisition/GE_CV");
const [
  addLogEvent,
] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat },
} = require("../../../utils/logger/enums");

const ge_mri_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
  };
  try {
    await addLogEvent(I, run_log, "ge_mri_parsers", cal, note, null);
    await log("info", job_id, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "sysError":
          const system = new GE_CV(sysConfigData, file, job_id);
          await ge_cv_sysError(system, run_log, job_id);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await addLogEvent(E, run_log, "ge_mri_parsers", cat, note, error);
    await log("error", job_id, "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_mri_parsers;
