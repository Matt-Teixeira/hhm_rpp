("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function philMonitorTableUpdate(jobId, sme, col_name, file_config, data, capture_datetime) {
  try {
    await log("info", jobId, sme, "philMonitorTableUpdate", "FN CALL", {
      sme: sme,
    });
    let processType = file_config.aggregation;

    switch (processType) {
      case "max":
        //return;
        await maxValue(jobId, sme, data, col_name, capture_datetime);
        break;
      case "min":
        //return;
        await minValue(jobId, sme, data, col_name, capture_datetime);
        break;
      case "bool":
        await booleanValue(jobId, sme, data, col_name, capture_datetime);
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

/*
file_config
{
  column: 'tech_room_temp_value',
  parsers: [ 'monitor_System_TempTechRoom' ],
  file_name: 'monitor_System_TempTechRoom.dat',
  pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
  aggregation: 'max'
}
*/