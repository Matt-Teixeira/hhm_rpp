const { log } = require("../../logger");
const ge_mri_parsers = require("./MRI");
const ge_ct_parsers = require("./CT");
const ge_cv_parsers = require("./CV");

const geModalities = async (jobId, sysConfigData) => {
  try {

    await log("info", jobId, "NA", "geModalities", "FN CALL");

    switch (sysConfigData.hhm_config.modality) {
      case "MRI":
        await ge_mri_parsers(jobId, sysConfigData);
        break;
      case "CT":
        await ge_ct_parsers(jobId, sysConfigData);
        break;
      case "CV":
        await ge_cv_parsers(jobId, sysConfigData);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, "NA", "geModalities", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = geModalities;
