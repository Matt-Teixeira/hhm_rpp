("use strict");
require("dotenv").config({ path: "../.env" });
const { log } = require("../logger");
const pgPool = require("../db/pg-pool");

async function getSystemDbData(jobId, sme) {
  try {
    const queryStr =
      "SELECT equipment_id, date FROM log.philips_mri_monitoring_data WHERE equipment_id = ($1) LIMIT 1";
    return await pgPool.query(queryStr, [sme]);
  } catch (error) {
    await log("error", jobId, sme, "getSystemDbData", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function getExistingDates(jobId, sme) {
  try {
    const text =
      "SELECT date FROM log.philips_mri_monitoring_data WHERE equipment_id = ($1)";
    const v = [sme];
    const systemDates = await pgPool.query(text, v);
    const systemDatesToArray = [];
    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.date);
    }
    return systemDatesToArray;
  } catch (error) {
    await log("error", jobId, sme, "getSystemDbData", "FN CALL", {
      sme: sme,
      error: error,
    });
  }
}

async function getDateRanges(jobId, sme, values) {
  try {
    let queryStr = `SELECT date FROM log.philips_mri_monitoring_data WHERE equipment_id = $1 AND date BETWEEN $2 AND $3`;

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
    const queryStr = `SELECT date FROM log.philips_mri_monitoring_data WHERE equipment_id = ($1) AND ${col_name} IS NOT NULL ORDER BY date DESC LIMIT 1`;
    const v = [sme];
    const systemDates = await pgPool.query(queryStr, v);
    const systemDatesToArray = [];
    for await (const date of systemDates.rows) {
      systemDatesToArray.push(date.date);
    }
    console.log("System Date in ARRAY: ", systemDatesToArray);
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
    const queryStr = `UPDATE log.philips_mri_monitoring_data SET ${col_name} = $1 WHERE equipment_id = $2 AND date = $3`;
    await pgPool.query(queryStr, arr);
  } catch (error) {
    await log("error", jobId, arr[1], "updateTable", "FN CALL", {
      sme: arr[1],
      error: error,
    });
  }
}

async function insertData(jobId, col_name, arr) {
  try {
    const queryStr = `INSERT INTO log.philips_mri_monitoring_data(equipment_id, date_time, date, ${col_name}) VALUES($1, $2, $3, $4)`;
    await pgPool.query(queryStr, arr);
  } catch (error) {
    await log("error", jobId, arr[0], "insertData", "FN CALL", {
      sme: arr[0],
      error: error,
    });
  }
}

const process_file_config = {
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
    col: "cryo_comp_press_alarm_value",
  },
  monitor_cryocompressor_talm: {
    type: "bool",
    col: "cryo_comp_temp_alarm_value",
  },
  monitor_magnet_quench: {
    type: "bool",
    col: "quenched_state",
  },
  monitor_magnet_helium_level_value: {
    type: "min",
    col: "helium_level_value",
  },
};

module.exports = {
  getSystemDbData,
  getExistingDates,
  getDateRanges,
  getExistingNotNullDates,
  updateTable,
  insertData,
  process_file_config,
};
