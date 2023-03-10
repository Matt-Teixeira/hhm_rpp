("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getDateRanges,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //cryo_comp_comm_error
const { convertDT } = require("../../../utils/dates");

async function booleanValue(jobId, sme, data, column) {
  try {
    await log("info", jobId, sme, "booleanValue", "FN CALL", {
      sme: sme,
    });

    console.log("\n ***** UPDATE BOOL ****** \n");

    console.log(data);

    // Get date ranges for smaller query and loop
    const startDate = data[data.length - 1].host_date;
    const endDate = data[0].host_date;

    const values = [sme, startDate, endDate];
    const systemDates = await getDateRanges(jobId, sme, values);

    // Aggregation bucket
    let bucket = [];
    let prevData = data[data.length - 1].host_date; //Set to first date in file data(file capture groups)

    console.log("PREVIOUS DATE: " + prevData);

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
        let maxValue = Math.max(...bucket);

        // Set value to = 1 or 0 (boolean)
        if (maxValue > 0) {
          maxValue = 1;
        } else {
          maxValue = 0;
        }

        // If date exists for sme: UPDATE row
        if (systemDates.includes(prevData)) {
          await updateTable(jobId, column, [maxValue, sme, prevData]);
          bucket = []; // Empty bucket
          prevData = obs.host_date; // Set to new date in iteration
          bucket.push(obs[column]); // Begin by pushing new data to our aggregation bucket
        } else {
          // If date dose not exist: INSERT new row
          let dtObj = await convertDT(prevData);
          await insertData(jobId, column, [sme, dtObj, prevData, maxValue]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
        }
      }
    }

    // Work with last set of dates in array
    if (systemDates.includes(prevData)) {
      // If date exists for sme: UPDATE row
      let maxValue = Math.max(...bucket);

      if (maxValue > 0) {
        maxValue = 1;
      } else {
        maxValue = 0;
      }

      await updateTable(jobId, column, [
        maxValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      let maxValue = Math.max(...bucket);

      if (maxValue > 0) {
        maxValue = 1;
      } else {
        maxValue = 0;
      }
      let dtObj = await convertDT(prevData);
      await insertData(jobId, column, [
        sme,
        dtObj,
        data[data.length - 1].host_date,
        maxValue,
      ]);
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "booleanValue", "FN CALL", {
      sme: sme,
      column: column,
      error: error,
    });
  }
}

module.exports = booleanValue;
