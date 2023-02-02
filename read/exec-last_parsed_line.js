const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function execLastEalLine(exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);

    // Example match '2023/02/01 08:19:35.864",3,'
    let last_line = newData.match(/(\d{4}\/\d{2}\/\d{2})\s\d{2}:\d{2}:\d{2}\.\d{3}",.+?,/);

    return last_line[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = execLastEalLine;
