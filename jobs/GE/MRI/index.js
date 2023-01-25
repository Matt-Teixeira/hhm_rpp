("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_mri_gesys = require("./gesys_parser");

const ge_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_mri_parsers", "FN CALL");
    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "gesys":
          await ge_mri_gesys(jobId, sysConfigData, file);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await log("error", jobId, sysConfigData.id, "ge_mri_parsers", "FN CATCH", {
      error: error.message,
    });
  }
};

module.exports = ge_mri_parsers;
