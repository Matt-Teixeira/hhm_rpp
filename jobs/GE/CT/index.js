("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");
const GE_CT_MRI = require("../../../data_acquisition/GE_CT_MRI");

const ge_ct_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "gesys":
          const system = new GE_CT_MRI(sysConfigData, file, jobId);
          console.log(system);
          await ge_ct_gesys(system);
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

module.exports = ge_ct_parsers;
