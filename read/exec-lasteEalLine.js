const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function execLastEalLine(exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);

    let last_line = newData.replace(/\d+-/, "");

    return last_line;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = execLastEalLine;
