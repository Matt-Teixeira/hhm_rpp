const { log } = require("../logger");
const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function execLineNumber(jobId, sme, exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);
    if (newData == "") {
      console.log(
        "In search for the last parsed line, empty string was returned"
      );
      throw new Error("In search for the last parsed line, empty string was returned");
    }
  
    return newData;
  } catch (error) {
    await log("error", jobId, sme, "execLineNumber", "FN CALL", { error });
    console.log(error);
    return null;
  }
}

module.exports = execLineNumber;
