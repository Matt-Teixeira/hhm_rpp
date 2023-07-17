const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../util/convert-rows-to-columns");
const queries = require("./queries");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../utils/logger/enums");

async function extracted_insert(job_id, data, pg_table, system_id, run_log) {
  let note = {
    job_id,
  };
  await addLogEvent(I, run_log, "extracted_insert", cal, note, null);
  try {
    if (data.length === 0) {
      throw new Error("File is empty/no matches");
    }

    const query = queries.extracted_metadata[`${pg_table}`];
    console.log(query);

    const payload = await convertRowsToColumns(job_id, system_id, data, run_log);
    const insertData = await pgPool.query(query, payload);

    await log("info", job_id, system_id, "extracted_insert", "FN CALL", {
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
    return true;
  } catch (error) {
    console.log("\nextracted_insert ERROR");
    console.log(error);
    let note = {
      job_id,
      sme: system_id,
    };
    await addLogEvent(E, run_log, "extracted_insert", cal, note, error);
    await log("error", job_id, system_id, "extracted_insert", `FN CALL`, {
      error: error.message,
    });
  }
}

module.exports = extracted_insert;
