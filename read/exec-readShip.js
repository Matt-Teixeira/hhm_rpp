const util = require("util");
const execFile = util.promisify(require("node:child_process").execFile);
const fs = require("node:fs").promises;

async function readShip() {
  const smePath = "./sh/readSME.sh";
  const smeFilePath = "/opt/hhm-files/CPP000/SHIP000";
  try {
    let files = await fs.readdir(smeFilePath);
    console.log(files);
    for await (const file of files) {
      const { stdout } = await execFile(smePath, [`${smeFilePath}/${file}`]);
      console.log(file);
      console.log(`${smeFilePath}/${file}`)
      console.log(stdout);
    }
  } catch (error) {
    console.log(error);
  }
}

readShip();
