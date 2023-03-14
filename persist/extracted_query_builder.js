const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../utils/convert-rows-to-columns");
const queries = require("./queries");

async function extracted_insert(jobId, data, pg_table, system_id) {
  try {
    console.log(data);

    if (data.length === 0) {
      throw new Error("File is empty/no matches");
    }

    const query = queries.extracted_metadata[`${pg_table}`];
    console.log(query);

    const payload = await convertRowsToColumns(jobId, system_id, data);
    const insertData = await pgPool.query(query, payload);

    await log("info", jobId, system_id, "extracted_insert", "FN CALL", {
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
    return true;
  } catch (error) {
    console.log(error);
    await log("error", jobId, system_id, "extracted_insert", `FN CALL`, {
      error: error.message,
    });
  }
}

module.exports = extracted_insert;
