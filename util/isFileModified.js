const fs = require("node:fs").promises;
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

module.exports = { isFileModified };
