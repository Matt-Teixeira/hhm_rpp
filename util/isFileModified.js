const fs = require("node:fs").promises;
const pgPool = require("../db/pg-pool");
const { log } = require("../logger");

async function isFileModified(jobId, sme, complete_file_path, fileToParse) {
  try {
    let date_time = await fs.stat(complete_file_path);

    let fileModTime = date_time.mtime.toISOString();

    if (fileModTime === fileToParse.last_mod) {
      await log("warn", jobId, sme, "parse_win_10", "FN CALL", {
        message: "File not mod since last data pull",
      });
      return false;
    } else return true;
  } catch (error) {
    await log("error", jobId, sme, "isFileModified", "FN CATCH", {
      error: error.message,
    });
  }
}

async function updateFileModTime(jobId, sme, complete_file_path, fileToParse) {
  try {
    let date_time = await fs.stat(complete_file_path);

    let fileModTime = date_time.mtime.toISOString();

    let queryStr =
      "UPDATE systems SET hhm_file_config = jsonb_set(hhm_file_config, $1, $2, false) WHERE id = $3";
    let values = [`{${fileToParse.index},last_mod}`, `"${fileModTime}"`, sme];
    await pgPool.query(queryStr, values);
    return true;
  } catch (error) {
    await log("error", jobId, sme, "updateFileModTime", "FN CATCH", {
      error: error.message,
    });
  }
}

module.exports = { isFileModified, updateFileModTime };
