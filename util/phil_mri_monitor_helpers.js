const { log } = require("../logger");
const db = require("../utils/db/pg-pool");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../utils/logger/enums");

async function getSystemDbData(job_id, run_log, sme) {
  let note = {
    job_id,
    sme,
  };
  try {
    await addLogEvent(I, run_log, "getSystemDbData", cal, note, null);
    const queryStr =
      "SELECT system_id, host_datetime FROM mag.philips_mri_monitoring_data WHERE system_id = $1 ORDER BY host_datetime DESC LIMIT 1";

    return await db.any(queryStr, [sme]);
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "getSystemDbData", cat, note, error);
  }
}

async function getExistingDates(jobId, sme) {
  try {
    const queryStr =
      "SELECT date FROM mag.philips_mri_monitoring_data WHERE system_id = $1";
    const v = [sme];
    const systemDates = await db.any(queryStr, v);

    const systemDatesToArray = [];
    for await (const date of systemDates) {
      systemDatesToArray.push(date.date);
    }
    return systemDatesToArray;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "getExistingDates", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function updateTable(jobId, col_name, arr) {
  try {
    if (arr[0] === -Infinity) return;
    const queryStr = `UPDATE mag.philips_mri_monitoring_data SET ${col_name} = $1 WHERE system_id = $2 AND date = $3`;
    await db.none(queryStr, arr);
  } catch (error) {
    console.log(error);
    await log("error", jobId, arr[1], "updateTable", "FN CALL", {
      values: arr,
      error: error,
    });
  }
}

async function insertData(jobId, col_name, arr) {
  try {
    if (arr[3] === -Infinity) return;
    const queryStr = `INSERT INTO mag.philips_mri_monitoring_data(system_id, host_datetime, date, ${col_name}) VALUES($1, $2, $3, $4)`;
    await db.none(queryStr, arr);
  } catch (error) {
    console.log(error);
    await log("error", jobId, arr[0], "insertData", "FN CALL", {
      values: arr,
      error: error,
    });
  }
}

async function update_jsonb_state(jobId, sme, values) {
  try {
    await log("info", jobId, sme, "update_jsonb_state", "FN CALL", {
      values,
    });
    const queryStr = `UPDATE mag.philips_mri_json SET process_success = true WHERE capture_time = $1`;
    await db.none(queryStr, values);
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "update_jsonb_state", "FN CALL", {
      values,
      error: error,
    });
  }
}

async function get_captured_datetime_entry(jobId, sme, values) {
  try {
    await log("info", jobId, sme, "get_captured_datetime_entry", "FN CALL", {
      values,
    });
    const queryStr = `SELECT * FROM mag.philips_mri_monitoring_data_agg WHERE capture_datetime = $1`;
    const entry = await db.any(queryStr, values);
    return entry;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "get_captured_datetime_entry", "FN CALL", {
      values,
      error: error,
    });
  }
}

async function insert_into_secondary_table(jobId, sme, col_name, values) {
  try {
    await log("info", jobId, sme, "insert_into_secondary_table", "FN CALL", {
      values,
    });
    const queryStr = `INSERT INTO mag.philips_mri_monitoring_data_agg(system_id, capture_datetime, host_datetime, date, ${col_name}) VALUES($1, $2, $3, $4, $5)`;
    await db.none(queryStr, values);
    return;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "insert_into_secondary_table", "FN CALL", {
      values,
      error: error,
    });
  }
}

async function update_secondary_table(jobId, sme, col_name, values) {
  try {
    await log("info", jobId, sme, "update_secondary_table", "FN CALL", {
      values,
    });
    const queryStr = `UPDATE mag.philips_mri_monitoring_data_agg SET ${col_name} = $1 WHERE system_id = $2 AND capture_datetime = $3`;
    await db.none(queryStr, values);
    return;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "update_secondary_table", "FN CALL", {
      values,
      error: error,
    });
  }
}

module.exports = {
  getSystemDbData,
  getExistingDates,
  updateTable,
  insertData,
  update_jsonb_state,
  get_captured_datetime_entry,
  insert_into_secondary_table,
  update_secondary_table,
};
