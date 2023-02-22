const { log } = require("../logger");
const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

async function exec_move_to_archive(jobId, sme, exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };
  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);

    return newData;
  } catch (error) {
    await log("error", jobId, sme, "exec_move_to_archive", "FN CALL", {
      error,
    });
    console.log(error);
    return null;
  }
}

module.exports = exec_move_to_archive;
