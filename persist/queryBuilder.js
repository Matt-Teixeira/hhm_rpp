const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../util/convert-rows-to-columns");
const queries = require("./queries");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../utils/logger/enums");

async function bulkInsert(job_id, data, sysConfigData, fileConfig, run_log) {
  let note = {
    job_id: job_id,
  };

  await addLogEvent(I, run_log, "bulkInsert", cal, note, null);
  try {
    if (data.length === 0) {
      throw new Error("File is empty/no matches");
    }

    const query =
      queries[`${sysConfigData.manufacturer}`][
        `${sysConfigData.hhm_config.modality}`
      ][`${fileConfig.query}`];
    console.log("\n" + sysConfigData.id);
    console.log(query);

    const payload = await convertRowsToColumns(job_id, sysConfigData.id, data, run_log);
    const insertData = await pgPool.query(query, payload);

    let note = {
      job_id: job_id,
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    };
    await addLogEvent(I, run_log, "bulkInsert", det, note, null);
    await log("info", job_id, sysConfigData.id, "bulkInsert", "FN CALL", {
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
    return true;
  } catch (error) {
    console.log(error);
    let note = {
      job_id: job_id,
      sme: sysConfigData.id,
    };
    await addLogEvent(E, run_log, "bulkInsert", cat, note, error);
    await log("error", job_id, sysConfigData.id, "bulkInsert", `FN CALL`, {
      error: error.message,
    });
  }
}

module.exports = bulkInsert;
