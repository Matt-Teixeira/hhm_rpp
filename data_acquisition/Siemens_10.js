const System = require("./System");
const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../logger");
const { updateRedisLine, getRedisLine } = require("../redis/redisHelpers");
const execLastMod = require("../read/exec-file_last_mod");

class Siemens_10 extends System {
  constructor(sysConfigData, fileToParse, job_id, run_log) {
    super(sysConfigData, fileToParse, job_id, run_log);
  }
  lastModPath = "./read/sh/get_file_last_mod.sh";
  redis_line;
  file_data;

  async get_redis_line() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.fileToParse,
    };
    try {
      this.redis_line = await getRedisLine(
        this.sme,
        this.fileToParse.file_name
      );
      await System.addLogEvent(
        this.I,
        this.run_log,
        "Siemens_10: get_redis_line",
        this.det,
        note
      );
    } catch (error) {
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Siemens_10: get_redis_line",
        this.cat,
        note,
        error
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "get_redis_line",
        "CLASS FN CALL",
        { error }
      );
    }
  }

  async is_file_present() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file_path: this.complete_file_path,
    };
    if (!fs.existsSync(this.complete_file_path)) {
      note.message = "File not found in directory";
      await System.addLogEvent(
        this.W,
        this.run_log,
        "Siemens_10: is_file_present",
        this.det,
        note
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "win10_siemens_mri",
        "FN CALL",
        {
          message: "File not found in directory",
          file: this.complete_file_path,
        }
      );
      return false;
    }
    return true;
  }

  async get_file_data() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file_path: this.complete_file_path,
    };
    await System.addLogEvent(
      this.I,
      this.run_log,
      "Siemens_10: get_file_data",
      this.cal,
      note
    );
    try {

      this.file_data = readline.createInterface({
        input: fs.createReadStream(this.complete_file_path),
        crlfDelay: Infinity,
      });
    } catch (error) {
      console.log(error);
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Siemens_10: get_file_data",
        this.cat,
        note,
        error
      );
    }
  }

  async update_redis_line(first_line) {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file_path: this.complete_file_path,
      update_line: first_line,
    };
    try {
      await System.addLogEvent(
        this.I,
        this.run_log,
        "Siemens_10: update_redis_line",
        this.cal,
        note
      );
      await updateRedisLine(this.sme, this.fileToParse.file_name, first_line);
    } catch (error) {
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Siemens_10: update_redis_line",
        this.cat,
        note,
        error
      );
    }
  }
}

module.exports = Siemens_10;
