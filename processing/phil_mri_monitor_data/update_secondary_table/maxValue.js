("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getDateRanges,
  updateTable,
  insertData,
  get_captured_datetime_entry,
  insert_into_secondary_table,
  update_secondary_table,
} = require("../../../utils/phil_mri_monitor_helpers"); //cryo_comp_malf_minutes
const { convertDT } = require("../../../utils/dates");

async function maxValue(jobId, sme, data, column, capture_datetime) {
  try {
    await log("info", jobId, sme, "maxValue", "FN CALL", {
      sme: sme,
    });

    // Get date ranges for smaller query and loop
    let previous_entries = await get_captured_datetime_entry(jobId, sme, [
      capture_datetime,
    ]);

    // max_value will be 
    let max_value;

    let current_largest = -9999;
    for (const data_entry of data) {
      if (data_entry[column] > current_largest) max_value = data_entry;
    }

    if (previous_entries.length < 1) {
      await insert_into_secondary_table(jobId, sme, column, [
        sme,
        capture_datetime,
        max_value[column],
      ]);
    } else {
      await update_secondary_table(jobId, sme, column, [
        max_value[column],
        sme,
        capture_datetime,
      ]);
    }
  } catch (error) {
    await log("error", jobId, sme, "maxValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
  }
}

module.exports = maxValue;
