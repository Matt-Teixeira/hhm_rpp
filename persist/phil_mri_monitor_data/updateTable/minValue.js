("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getDateRanges,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers");

async function minValue(jobId, sme, data, column) {
  try {
    await log("info", jobId, sme, "minValue", "FN CALL", {
      sme: sme,
    });

    // Get date ranges for smaller query and loop
    const startDate = data[data.length - 1].host_date;
    const endDate = data[0].host_date;

    const values = [sme, startDate, endDate];
    const systemDates = await getDateRanges(jobId, sme, values);

    // Aggregation bucket
    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    // loop through each observation in the array of match groups. Seperated by column name.
    for await (const obs of data) {
      let currentDate = obs.host_date;

      // If dates are the same, push data to array for future aggregation
      if (currentDate === prevData) {
        bucket.push(obs[column]);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates and begin aggregation
        const minValue = Math.min(...bucket);

        // If date exists for sme: UPDATE row
        if (systemDates.includes(prevData)) {
          await updateTable(jobId, column, [minValue, sme, prevData]);
          bucket = []; // Empty bucket
          prevData = obs.host_date; // Set to new date in iteration
          bucket.push(obs[column]); // Begin by pushing new data to our aggregation bucket
        } else {
          // If date dose not exist: INSERT new row
          await insertData(jobId, column, [sme, prevData, minValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
        }
      }
    }

    // Work with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      const minValue = Math.min(...bucket);
      await updateTable(jobId, column, [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.min(...bucket);
      await insertData(jobId, column, [
        sme,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
  } catch (error) {
    await log("error", jobId, sme, "minValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
  }
}

module.exports = minValue;
