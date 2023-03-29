("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingNotNullDates,
  process_file_config,
} = require("../../../utils/phil_mri_monitor_helpers");
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

    console.log("col_name");
    console.log(col_name);
    console.log("systemDates");
    console.log(systemDates);
    console.log("lastFileDate");
    console.log(lastFileDate);

    if (lastFileDate !== systemDates[0]) {
      const updateData = [];
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i].host_date !== systemDates[0]) {
          console.log("INSIDE OF SECOND IF")
          updateData.push(data[i]);
          console.log("CONSOLE LOGGING UPDATE DATA")
          console.log(updateData);
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
      console.log("updateData - Outside if");
      console.log(updateData);
      console.log("\n" + "**********  **********" + "\n");
      await philMonitorTableUpdate(jobId, sme, col_name, file_config, updateData);

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