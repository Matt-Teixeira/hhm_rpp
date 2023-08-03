const { log } = require("../../../logger");
const ge_cv_sysError = require("./sysError_parser");
const GE_CT_CV_MRI = require("../../../data_acquisition/GE_CT_CV_MRI");
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
    sme: sysConfigData.id
  };
  try {
    await addLogEvent(I, run_log, "ge_mri_parsers", cal, note, null);
    await log("info", job_id, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "sysError":
          const System = new GE_CT_CV_MRI(sysConfigData, file, job_id, run_log);
          await ge_cv_sysError(System);
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
