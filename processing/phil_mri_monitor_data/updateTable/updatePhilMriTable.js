("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingNotNullDates,
} = require("../../../util/phil_mri_monitor_helpers");
const philMonitorTableUpdate = require("./index");

async function updatePhilMriTable(jobId, sme, file_config, data) {
  try {
    await log("info", jobId, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
    });

    const col_name = file_config.column;

    const systemDates = await getExistingNotNullDates(jobId, sme, col_name);

    const lastFileDate = data[data.length - 1].host_date;

    if (lastFileDate !== systemDates[0]) {
      const updateData = [];
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].host_date !== systemDates[0]) {
          if (data[i]) updateData.push(data[i]);
        } else {
          await philMonitorTableUpdate(
            jobId,
            sme,
            col_name,
            file_config,
            updateData
          );

          return;
        }
      }

      await philMonitorTableUpdate(
        jobId,
        sme,
        col_name,
        file_config,
        updateData
      );

      return;
    }
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
