const System = require("./System");
const fs = require("node:fs");
const readline = require("readline");
const { updateRedisLine, getRedisLine } = require("../redis/redisHelpers");

class Siemens_10 extends System {
  constructor(sysConfigData, file_config, job_id, run_log) {
    super(sysConfigData, file_config, job_id, run_log);
    this.complete_file_path = `${sysConfigData.hhm_config.file_path}/${file_config.file_name}`;
  }
  lastModPath = "./read/sh/get_file_last_mod.sh";
  redis_line;
  file_data;

  async get_redis_line() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config,
    };
    try {
      this.redis_line = await getRedisLine(
        this.sme,
        this.file_config.file_name
      );
      await this.addLogEvent(
        this.I,
        this.run_log,
        "Siemens_10: get_redis_line",
        this.det,
        note
      );
    } catch (error) {
      await this.addLogEvent(
        this.E,
        this.run_log,
        "Siemens_10: get_redis_line",
        this.cat,
        note,
        error
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
      await this.addLogEvent(
        this.W,
        this.run_log,
        "Siemens_10: is_file_present",
        this.det,
        note
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
    await this.addLogEvent(
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
      await this.addLogEvent(
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
      await this.addLogEvent(
        this.I,
        this.run_log,
        "Siemens_10: update_redis_line",
        this.cal,
        note
      );
      await updateRedisLine(this.sme, this.file_config.file_name, first_line);
    } catch (error) {
      await this.addLogEvent(
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
