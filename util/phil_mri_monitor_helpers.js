const { log } = require("../logger");
const pgPool = require("../db/pg-pool");
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
      "SELECT system_id, host_datetime FROM mag.philips_mri_monitoring_data WHERE system_id = ($1) ORDER BY host_datetime DESC LIMIT 1";
    return await pgPool.query(queryStr, [sme]);
  } catch (error) {
    await addLogEvent(E, run_log, "getSystemDbData", cat, note, error);
  }
}

async function getExistingDates(jobId, sme) {
  try {
    const text =
      "SELECT date FROM mag.philips_mri_monitoring_data WHERE system_id = ($1)";
    const v = [sme];
    const systemDates = await pgPool.query(text, v);
    const systemDatesToArray = [];
    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getExistingDates", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function getDateRanges(jobId, sme, values) {
  try {
    let queryStr = `SELECT date FROM mag.philips_mri_monitoring_data WHERE system_id = $1 AND date BETWEEN $2 AND $3`;

    const systemDates = await pgPool.query(queryStr, values);
    const systemDatesToArray = [];

    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getDateRanges", "FN CALL", {
      sme: sme,
      values: values,
      error: error,
    });
  }
}

async function getExistingNotNullDates(jobId, sme, col_name) {
  try {
    const queryStr = `SELECT date FROM mag.philips_mri_monitoring_data WHERE system_id = ($1) AND ${col_name} IS NOT NULL ORDER BY date DESC LIMIT 1`;
    const v = [sme];
    const systemDates = await pgPool.query(queryStr, v);
    const systemDatesToArray = [];
    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getExistingNotNullDates", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function updateTable(jobId, col_name, arr) {
  try {
    if (arr[0] === -Infinity) return;
    const queryStr = `UPDATE mag.philips_mri_monitoring_data SET ${col_name} = $1 WHERE system_id = $2 AND date = $3`;
    await pgPool.query(queryStr, arr);
  } catch (error) {
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
    await pgPool.query(queryStr, arr);
  } catch (error) {
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
    await pgPool.query(queryStr, values);
  } catch (error) {
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
    const entry = await pgPool.query(queryStr, values);
    return entry.rows;
  } catch (error) {
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
    const entry = await pgPool.query(queryStr, values);
    return entry.rows;
  } catch (error) {
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
    const entry = await pgPool.query(queryStr, values);
    return entry.rows;
  } catch (error) {
    await log("error", jobId, sme, "update_secondary_table", "FN CALL", {
      values,
      error: error,
    });
  }
}

/* const process_file_config = {
  monitor_System_HumExamRoom: {
    type: "max",
    col: "tech_room_humidity_value",
  },
  monitor_System_HumTechRoom: {
    type: "max",
    col: "tech_room_humidity_value",
  },
  monitor_System_TempTechRoom: {
    type: "max",
    col: "tech_room_temp_value",
  },
  monitor_magnet_lt_boiloff: {
    type: "max",
    col: "long_term_boil_off_value",
  },
  monitor_cryocompressor_time_status: {
    type: "max",
    col: "cryo_comp_malf_value",
  },
  monitor_magnet_pressure_dps: {
    type: "max",
    col: "mag_dps_status_value",
  },
  monitor_cryocompressor_cerr: {
    type: "bool",
    col: "cryo_comp_comm_error_state",
  },
  monitor_cryocompressor_palm: {
    type: "bool",
    col: "cryo_comp_press_alarm_state",
  },
  monitor_cryocompressor_talm: {
    type: "bool",
    col: "cryo_comp_temp_alarm_state",
  },
  monitor_magnet_quench: {
    type: "bool",
    col: "quenched_state",
  },
  monitor_magnet_helium_level_value: {
    type: "min",
    col: "helium_level_value",
  },
}; */

module.exports = {
  getSystemDbData,
  getExistingDates,
  getDateRanges,
  getExistingNotNullDates,
  updateTable,
  insertData,
  update_jsonb_state,
  get_captured_datetime_entry,
  insert_into_secondary_table,
  update_secondary_table,
};
