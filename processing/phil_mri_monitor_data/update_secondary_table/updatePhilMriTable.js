const { log } = require("../../../logger");
const philMonitorTableUpdate = require("./index");

async function updatePhilMriTable(jobId, sme, file_config, data, date) {
  try {
    await log("info", jobId, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
    });

    const col_name = file_config.column;

    let successful_agg = await philMonitorTableUpdate(
      jobId,
      sme,
      col_name,
      file_config,
      data,
      date
    );

    return successful_agg;
  } catch (error) {
    await log("error", jobId, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
      error: error,
    });
  }
}

module.exports = updatePhilMriTable;
