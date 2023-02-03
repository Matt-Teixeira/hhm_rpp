const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function execLastEalLine(exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);

    console.log("NEW DATA: " + newData)
    // Example match "2023/02/02 15:02:33.354__01",0, | "2023/02/02 15:02:33.354__01",0,
    let last_line = newData.match(/"(\d{4}\/\d{2}\/\d{2})\s\d{2}:\d{2}:\d{2}\.\d{3}(.+\d)?",.+?,/);

    if(!last_line) {
      throw new Error("Could not parse/format last line to save in redis")
    }

    return last_line[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = execLastEalLine;
