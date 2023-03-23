const System = require("./System");
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../logger");
const { updateRedisLine, getRedisLine } = require("../redis/redisHelpers");
const execLastMod = require("../read/exec-file_last_mod");

class Siemens_10 extends System {
  constructor(sysConfigData, fileToParse, jobId) {
    super(sysConfigData, fileToParse, jobId);
  }
  lastModPath = "./read/sh/get_file_last_mod.sh";
  redis_line;
  file_data;

  async get_redis_line() {
    try {
      this.redis_line = await getRedisLine(
        this.sme,
        this.fileToParse.file_name
      );
    } catch (error) {
      await log(
        "error",
        this.jobId,
        this.sme,
        "get_redis_line",
        "CLASS FN CALL",
        { error }
      );
    }
  }

  async is_file_present() {
    if (!fs.existsSync(this.complete_file_path)) {
      await log("error", this.jobId, this.sme, "win10_siemens_mri", "FN CALL", {
        message: "File not found in directory",
        file: this.complete_file_path,
      });
      return false;
    }
    return true;
  }

  async get_file_data() {
    this.file_data = readline.createInterface({
      input: fs.createReadStream(this.complete_file_path),
      crlfDelay: Infinity,
    });
  }

  async update_redis_line(first_line){
    await updateRedisLine(this.sme, this.fileToParse.file_name, first_line);
  }
}

module.exports = Siemens_10;
