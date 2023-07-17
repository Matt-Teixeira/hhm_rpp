("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  get_captured_datetime_entry,
  insert_into_secondary_table,
  update_secondary_table,
} = require("../../../util/phil_mri_monitor_helpers"); //cryo_comp_malf_minutes
const { convertDT } = require("../../../util/dates");

async function boolValue(jobId, sme, data, column, capture_datetime) {
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
      if (parseInt(data_entry[column]) > current_largest_value)
        max_value = data_entry;
      current_largest_value = parseInt(data_entry[column]);
    }

    if (parseInt(max_value[column]) > 0) {
      max_value[column] = 1;
    } else {
      max_value[column] = 0;
    }

    if (previous_entries.length < 1) {
      const host_datetime = await convertDT(max_value.host_date);
      await insert_into_secondary_table(jobId, sme, column, [
        sme,
        capture_datetime,
        host_datetime,
        max_value.host_date,
        max_value[column],
      ]);
    } else {
      await update_secondary_table(jobId, sme, column, [
        max_value[column],
        sme,
        capture_datetime,
      ]);
    }
    return true;
  } catch (error) {
    await log("error", jobId, sme, "boolValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
    return false;
  }
}

module.exports = boolValue;
