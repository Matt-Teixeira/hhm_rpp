("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_mri_gesys = require("./gesys_parser");
const GE_CT_MRI = require("../../../data_acquisition/GE_CT_MRI");

const ge_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_mri_parsers", "FN CALL");
    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "gesys":
          const system = new GE_CT_MRI(sysConfigData, file, jobId);
          await ge_mri_gesys(system);
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
