const {
  getExistingDates,
  updateTable,
  insertData,
} = require("../../../util/phil_mri_monitor_helpers");
const { convertDT } = require("../../../util/dates");

async function minValue(run_log, sme, data, column) {
  try {
    // Get all rows/dates for this sme
    const systemDates = await getExistingDates(run_log, sme);

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
        const minValue = Math.min(...bucket);

        if (systemDates.includes(prevData)) {
          // If date exists for sme: UPDATE row
          await updateTable(run_log, column, [minValue, sme, prevData]);
          bucket = [];
          prevData = obs.host_date;
          bucket.push(obs[column]);
        } else {
          // If date dose not exist: INSERT new row
          let dtObj = await convertDT(prevData);
          await insertData(run_log, column, [sme, dtObj, prevData, minValue]);
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
      await updateTable(run_log, column, [
        minValue,
        sme,
        data[data.length - 1].host_date,
      ]);
    } else {
      // If date dose not exist: INSERT new row
      const minValue = Math.min(...bucket);
      let dtObj = await convertDT(data[data.length - 1].host_date);
      await insertData(run_log, column, [
        sme,
        dtObj,
        data[data.length - 1].host_date,
        minValue,
      ]);
    }
    return true;
  } catch (error) {
    let note = {
      sme: sme,
      column: column,
    };
    console.log(error);
    await addLogEvent(E, run_log, "initUpdate: minValue", cat, note, error);
    return false;
  }
}

module.exports = minValue;
