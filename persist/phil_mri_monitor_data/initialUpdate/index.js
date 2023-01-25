("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  process_file_config,
} = require("../../../utils/phil_mri_monitor_helpers");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function initialUpdate(jobId, sme, fileName, data) {
  try {
    await log("info", jobId, sme, "initialUpdate", "FN CALL", {
      sme: sme,
      file: fileName,
    });
    let processType = process_file_config[fileName].type;

    console.log(processType)
    switch (processType) {
      case "max":
        await maxValue(jobId, sme, data, process_file_config[fileName].col);
        break;
      case "min":
        await minValue(jobId, sme, data, process_file_config[fileName].col);
        break;
      case "bool":
        await booleanValue(jobId, sme, data, process_file_config[fileName].col);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, sme, "initialUpdate", "FN CALL", {
      sme: sme,
      file: fileName,
      error: error,
    });
  }
}

module.exports = initialUpdate;
