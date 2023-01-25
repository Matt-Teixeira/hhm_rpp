const pgPool = require("../db/pg-pool");
const { log } = require("../logger");
const convertRowsToColumns = require("../utils/convert-rows-to-columns");
const queries = require("./queries");

async function bulkInsert(jobId, data, sysConfigData, fileConfig) {
  try {
    if (data.length === 0) {
      throw new Error("File is empty/no matches");
    }
    //const fileQuery = fileConfig.query;

   /*  console.log(sysConfigData.manufacturer);
    console.log(sysConfigData.hhm_config.modality);
    console.log(fileQuery); */

    

    const query =
      queries[`${sysConfigData.manufacturer}`][
        `${sysConfigData.hhm_config.modality}`
      ][`${fileConfig.query}`];
    console.log(query);

    const payload = await convertRowsToColumns(jobId, sysConfigData.id, data);
    const insertData = await pgPool.query(query, payload);

    await log("info", jobId, sysConfigData.id, "bulkInsert", "FN CALL", {
      query: JSON.stringify(query),
      rowsInserted: insertData.rowCount,
    });
    return true;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sysConfigData.id, "bulkInsert", `FN CALL`, {
      error: error.message,
    });
  }
}

module.exports = bulkInsert;
