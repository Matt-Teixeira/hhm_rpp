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

async function boolValue(jobId, sme, data, column, capture_datetime) {
  console.log("RUNNING BOOL VALUE")
  try {
    await log("info", jobId, sme, "boolValue", "FN CALL", {
      sme: sme,
    });

    // Get date ranges for smaller query and loop
    let previous_entries = await get_captured_datetime_entry(jobId, sme, [
      capture_datetime,
    ]);

    // max_value will be the object whos column property is largest
    let max_value;

    let current_largest_value = -9999;
    for (const data_entry of data) {
      console.log("data_entry")
      console.log(data_entry)
      if (parseInt(data_entry[column]) > current_largest_value) max_value = data_entry;
    }

    if (max_value[column] > 0) {
      max_value[column] = 1;
    } else {
      max_value[column] = 0;
    }

    console.log("max_value")
    console.log(max_value)

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

    console.log("column");
    console.log(column);
    console.log(capture_datetime);
  } catch (error) {
    await log("error", jobId, sme, "boolValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
  }
}

/* // Set value to = 1 or 0 (boolean)
if (maxValue > 0) {
  maxValue = 1;
} else {
  maxValue = 0;
} */

module.exports = boolValue;
