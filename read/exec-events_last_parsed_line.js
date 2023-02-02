const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

// /home/matt-teixeira/hep3/hhm_rpp/read/sh/getLineNumber.sh

async function execLastEventsLine(exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 10,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);

    console.log("NEW DATA: " + newData);
    // Example match ,63810836376,"2023/02/01 08:19:35.864"
    let last_line = newData.match(/,\d+,"\d{4}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3}"|".*"\d{2}\/\d{2}\/\d{2}\s\d{2}:\d{2}:\d{2}"/);

    console.log(last_line);

    return last_line[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = execLastEventsLine;