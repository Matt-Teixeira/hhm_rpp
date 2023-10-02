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
    sme: sysConfigData.id
  };

  try {
    await addLogEvent(I, run_log, "geModalities", cal, note, null);

    switch (sysConfigData.modality) {
      case "MRI":
        await ge_mri_parsers(job_id, sysConfigData, run_log);
        break;
      case "CT":
        await ge_ct_parsers(job_id, sysConfigData, run_log);
        break;
      case "CV/IR":
        await ge_cv_parsers(job_id, sysConfigData, run_log);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "geModalities", cat, note, error);
  }
};

module.exports = geModalities;
