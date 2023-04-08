("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const philMonitorTableUpdate = require("./index");

async function updatePhilMriTable(jobId, sme, file_config, data, date) {
  try {
    await log("info", jobId, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
    });

    const col_name = file_config.column;

      await philMonitorTableUpdate(
        jobId,
        sme,
        col_name,
        file_config,
        data,
        date
      );

      return;
  
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
      error: error,
    });
  }
}

module.exports = updatePhilMriTable;

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
