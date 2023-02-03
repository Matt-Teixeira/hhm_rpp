const { log } = require("../logger");
const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function exec_events_delta_v2(jobId, sme, exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };
  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);
    if (newData == "") {
      console.log(
        "In search for the last parsed line, empty string was returned"
      );
      throw new Error(
        "In search for the last parsed line, empty string was returned"
      );
    }

    if (newData.trim() === "false") {
      return false;
    }

    // Extract new line data to update redis
    const re = /new_events_line_count:\s(?<new_events_line_count>\d+)\snew_eal_end_line_num:\s(?<new_eal_end_line_num>\d+)/
    const matches = newData.match(re);

    const data = {
      file_data: newData,
      new_events_line_count: matches.groups.new_events_line_count, 
      new_eal_end_line_num: matches.groups.new_eal_end_line_num
    }

    return data;
  } catch (error) {
    await log("error", jobId, sme, "exec_events_delta_v2", "FN CALL", { error });
    console.log(error);
    return null;
  }
}

module.exports = exec_events_delta_v2;
