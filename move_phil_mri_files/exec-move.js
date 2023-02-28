const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);

async function exec_move(exec_path, args) {
  const execOptions = {
    maxBuffer: 1024 * 1024 * 25,
  };

  try {
    const { stdout: newData } = await execFile(exec_path, args, execOptions);
    
    console.log(newData.trim());
    return newData.trim();
  } catch (error) {
    console.log(error);
    return null;
  }
}

module.exports = exec_move;
