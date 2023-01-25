("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  process_file_config,
} = require("../../../utils/phil_mri_monitor_helpers");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function philMonitorTableUpdate(jobId, sme, col_name, fileName, data) {
  try {
    await log("info", jobId, sme, "philMonitorTableUpdate", "FN CALL", {
      sme: sme,
    });
    let processType = process_file_config[fileName].type;

    switch (processType) {
      case "max":
        await maxValue(jobId, sme, data, col_name);
        break;
      case "min":
        await minValue(jobId, sme, data, col_name);
        break;
      case "bool":
        await booleanValue(jobId, sme, data, col_name);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, sme, "philMonitorTableUpdate", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

module.exports = philMonitorTableUpdate;
