("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function philMonitorTableUpdate(
  jobId,
  sme,
  col_name,
  file_config,
  data,
  capture_datetime
) {
  try {
    await log("info", jobId, sme, "philMonitorTableUpdate", "FN CALL", {
      sme: sme,
    });
    let processType = file_config.aggregation;
    let successful_agg = false;

    switch (processType) {
      case "max":
        successful_agg = await maxValue(
          jobId,
          sme,
          data,
          col_name,
          capture_datetime
        );
        break;
      case "min":
        successful_agg = await minValue(
          jobId,
          sme,
          data,
          col_name,
          capture_datetime
        );
        break;
      case "bool":
        successful_agg = await booleanValue(
          jobId,
          sme,
          data,
          col_name,
          capture_datetime
        );
        break;
      default:
        break;
    }
    return successful_agg;
  } catch (error) {
    await log("error", jobId, sme, "philMonitorTableUpdate", "FN CALL", {
      sme: sme,
      error: error,
    });
    return false;
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
