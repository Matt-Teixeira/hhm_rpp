const fs = require("node:fs").promises;
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../utils/logger/enums");

async function isFileModified(run_log, sme, complete_file_path, fileToParse) {
  let note = {
    sme,
    complete_file_path,
    fileToParse,
  };
  try {
    let date_time = await fs.stat(complete_file_path);

    let fileModTime = date_time.mtime.toISOString();

    if (fileModTime === fileToParse.last_mod) {
      await addLogEvent(I, run_log, "isFileModified", det, note, null);
      return false;
    } else return true;
  } catch (error) {
    await addLogEvent(E, run_log, "isFileModified", cat, note, error);
  }
}

module.exports = { isFileModified };
