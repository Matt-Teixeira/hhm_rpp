const ge_cv_sysError = require("./sysError_parser");
const GE_CT_CV_MRI = require("../../../data_acquisition/GE_CT_CV_MRI");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat },
} = require("../../../utils/logger/enums");

const ge_mri_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
    sme: sysConfigData.id,
  };
  try {
    await addLogEvent(I, run_log, "ge_mri_parsers", cal, note, null);
    for await (const file of sysConfigData.log_config) {
      switch (file.dir_name) {
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
  }
};

module.exports = ge_mri_parsers;
