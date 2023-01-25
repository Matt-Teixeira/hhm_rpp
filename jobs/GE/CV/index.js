("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_cv_sysError = require("./sysError_parser");

const ge_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "sysError":
          await ge_cv_sysError(jobId, sysConfigData, file);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await log("error", jobId, "NA", "ge_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = ge_mri_parsers;
