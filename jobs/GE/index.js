const { log } = require("../../logger");
const ge_mri_parsers = require("./MRI");
const ge_ct_parsers = require("./CT");
const ge_cv_parsers = require("./CV");
const [addLogEvent] = require("../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../utils/logger/enums");

const geModalities = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
  };
  try {
    await addLogEvent(I, run_log, "geModalities", cal, note, null);
    await log("info", job_id, "NA", "geModalities", "FN CALL");

    switch (sysConfigData.hhm_config.modality) {
      case "MRI":
        await ge_mri_parsers(job_id, sysConfigData, run_log);
        break;
      case "CT":
        await ge_ct_parsers(job_id, sysConfigData, run_log);
        break;
      case "CV":
        await ge_cv_parsers(job_id, sysConfigData, run_log);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "geModalities", cat, note, error);
    await log("error", job_id, "NA", "geModalities", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = geModalities;
