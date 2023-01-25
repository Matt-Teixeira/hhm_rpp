const fs = require("node:fs").promises;
const pgPool = require("../db/pg-pool");
const { log } = require("../logger");

async function isFileModified(jobId, sme, complete_file_path, fileToParse) {
  try {
    let date_time = await fs.stat(complete_file_path);

    let fileModTime = date_time.mtime.toISOString();

    if (fileModTime === fileToParse.last_mod) {
      console.log("File not mod since last data pull");
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
    console.log("File changed: date time updated");
    return true;
  } catch (error) {
    await log("error", jobId, sme, "updateFileModTime", "FN CATCH", {
      error: error.message,
    });
  }
}

module.exports = { isFileModified, updateFileModTime };

/* let queryStr =
        "WITH file_index AS ( SELECT ('{'||index-1||',last_mod}')::text[] AS path FROM systems ,jsonb_array_elements(hhm_file_config) WITH ORDINALITY arr(file, index) WHERE file->>'file_name' = $1) UPDATE systems SET hhm_file_config = jsonb_set(hhm_file_config, file_index.path, $2, true) FROM file_index WHERE id = $3 RETURNING *";
      values = [fileToParse.file_name, `"${d}"`, sme]; */
