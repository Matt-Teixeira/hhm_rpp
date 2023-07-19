const { log } = require("../../logger");
const philips_ct_parsers = require("./CT");
const philips_mri_parsers = require("./MRI");
const philips_cv_parsers = require("./CV");
const [addLogEvent] = require("../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../utils/logger/enums");

const philipsModalities = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
    sme: sysConfigData.id,
  };

  try {
    await addLogEvent(I, run_log, "philipsModalities", cal, note, null);
    await log("info", job_id, sysConfigData.id, "philipsModalities", "FN CALL");
    const modality = sysConfigData.hhm_config.modality;

    switch (modality) {
      case "MRI":
        await philips_mri_parsers(job_id, sysConfigData, run_log);
        break;
      case "CT":
        await philips_ct_parsers(job_id, sysConfigData, run_log);
        break;
      case "CV":
        await philips_cv_parsers(job_id, sysConfigData, run_log);
        break;
      default:
        break;
    }
  } catch (error) {
    await addLogEvent(E, run_log, "philipsModalities", cat, note, error);
    await log(
      "error",
      job_id,
      sysConfigData.id,
      "philipsModalities",
      "FN CATCH",
      {
        error: error,
      }
    );
  }
};

module.exports = philipsModalities;
