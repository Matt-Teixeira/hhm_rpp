("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../utils/phil_mri_monitor_helpers"); //cryo_comp_comm_error
const {convertDT} = require("../../../utils/dates");

async function booleanValue(jobId, sme, data, column) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(jobId, sme);

    let bucket = [];
    let prevData = data[0].host_date; //Set to first date in file data(file capture groups)

    for await (const obs of data) {
      let currentDate = obs.host_date;

      if (currentDate === prevData) {
        bucket.push(obs[column]);
        prevData = currentDate;
        continue;
      }
      if (currentDate !== prevData) {
        // Not equal means a change in dates
        let maxValue = Math.max(...bucket);

        if (maxValue > 0) {
          maxValue = 1;
        } else {
          maxValue = 0;
        }

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable(jobId, column, [maxValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
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

    // Deal with last set of dates in array
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

      let dtObj = await convertDT(data[data.length - 1].host_date);
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
