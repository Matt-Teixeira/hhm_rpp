const { log } = require("../../../logger");
const philMonitorTableUpdate = require("./index");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

async function updatePhilMriTable(
  job_id,
  sme,
  file_config,
  data,
  date,
  run_log
) {
  let note = {
    job_id,
    sme,
    file: file_config.file_name,
  };
  try {
    await addLogEvent(I, run_log, "updatePhilMriTable", cal, note, null);

    const col_name = file_config.column;

    let successful_agg = await philMonitorTableUpdate(
      job_id,
      sme,
      col_name,
      file_config,
      data,
      date,
      run_log
    );

    return successful_agg;
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "updatePhilMriTable", cat, note, error);
    await log("error", job_id, sme, "updatePhilMriTable", "FN CALL", {
      sme: sme,
      file: file_config,
      error: error,
    });
  }
}

module.exports = updatePhilMriTable;
