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

    const col_name = process_file_config[fileName].col;
    const systemDates = await getExistingNotNullDates(jobId, sme, col_name);

    const lastFileDate = data[data.length - 1].host_date;

    if (lastFileDate !== systemDates[0]) {
      const updateData = [];
      for (let i = data.length - 1; i > 0; i--) {
        if (data[i].host_date !== systemDates[0]) {
          updateData.push(data[i]);
        } else {
          console.log(col_name);
          await philMonitorTableUpdate(jobId, sme, col_name, fileName, updateData);
          return;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = updatePhilMriTable;
