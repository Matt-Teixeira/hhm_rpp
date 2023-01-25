const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

async function execHead(exec_path, delta, file_path) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 25,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, [delta, file_path], execOptions);
    return newData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = execHead;