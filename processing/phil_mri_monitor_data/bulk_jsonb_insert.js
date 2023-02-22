("use strict");
require("dotenv").config({ path: "../.env" });
const { log } = require("../../logger");
const pgPool = require("../../db/pg-pool");

async function insertJsonB(jobId, value) {
  const sme = value[0];
  try {
    await log("info", jobId, sme, "insertJsonB", "FN CALL", {
      sme: sme,
    });
    const date = new Date();
    value.unshift(date);
    const queryString =
      "INSERT INTO log.philips_mri_json(capture_time, system_id, monitoring_data) VALUES($1, $2, $3)";
    return await pgPool.query(queryString, value);
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "insertJsonB", "FN CALL", {
      sme: sme,
    });
  }
}

module.exports = insertJsonB;
