("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const ge_ct_gesys = require("./gesys_parser");

const ge_ct_parsers = async (jobId, sysConfigData) => {
  try {
    await log("info", jobId, "NA", "ge_ct_parsers", "FN CALL");

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "gesys":
          await ge_ct_gesys(jobId, sysConfigData, file);
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
