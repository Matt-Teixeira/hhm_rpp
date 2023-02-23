("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingNotNullDates,
  process_file_config,
} = require("../../../utils/phil_mri_monitor_helpers");
const philMonitorTableUpdate = require("./index");

async function updatePhilMriTable(jobId, sme, fileName, data) {
  try {
    await log("info", jobId, sme, "booleanValue", "FN CALL", {
      sme: sme,
      file: fileName,
    });
    //console.log(data);

    const col_name = process_file_config[fileName].col;
    console.log("\n" + col_name);
    const systemDates = await getExistingNotNullDates(jobId, sme, col_name);

    const lastFileDate = data[data.length - 1].host_date;
    console.log(lastFileDate);

    if (lastFileDate !== systemDates[0]) {
      console.log("Creating updateData array");
      const updateData = [];
      for (let i = data.length - 1; i > 0; i--) {
        if (data[i].host_date !== systemDates[0]) {
          console.log(data[i].host_date);
          console.log(systemDates[0])
          updateData.push(data[i]);
        } else {
          console.log("philMonitorTableUpdate");
          await philMonitorTableUpdate(
            jobId,
            sme,
            col_name,
            fileName,
            updateData
          );
          
          return;
        }
      }
      await philMonitorTableUpdate(
        jobId,
        sme,
        col_name,
        fileName,
        updateData
      );
      
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = updatePhilMriTable;
