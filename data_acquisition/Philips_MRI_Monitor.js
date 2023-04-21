const { log } = require("../logger");
const fs = require("node:fs").promises;
const {
  getRedisLine,
  updateRedisLine,
} = require("../redis/philips_monitoring");
const exec_tail_last_line = require("../read/exec-tail-last-line");
const exec_monitor_delta = require("../read/exec-monitor_delta");
const execLastMod = require("../read/exec-file_last_mod");

class PHILIPS_MRI_MONITORING {
  constructor(jobId, sysConfigData) {
    (this.jobId = jobId), (this.sysConfigData = sysConfigData);
    this.sme = this.sysConfigData.id;
  }

  exec_tail_path = "./read/sh/tail_late_line.sh";
  exec_monitor_delta_path = "./read/sh/get_monitor_delta.sh";
  lastModPath = "./read/sh/get_file_last_mod.sh";

  async get_all_monitor_data(complete_file_path) {
    try {
      const file_data = (await fs.readFile(complete_file_path)).toString();
      return file_data;
    } catch (error) {
      await log(
        "error",
        this.jobId,
        this.sme,
        "get_all_monitor_data",
        "FN CALL",
        { error }
      );
    }
  }

  async get_redis_line(file) {
    let last_line = await getRedisLine(this.sme, file.file_name);

    if (last_line === null || last_line === "") return null;

    const matched_last_line = last_line.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}|\d+-[A-Z]+-\d{4}\s+(-)?\d+/)[0]; // \d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2} 4/21/2023 change

    if (!matched_last_line) {
      await log("error", this.jobId, this.sme, "get_redis_line", "FN CALL", {
        message: "last_line is null. Need to mod regex",
        re: /\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}|\d+-[A-Z]+-\d{4}\s+(-)?\d+/,
        last_line,
        matched_last_line,
      });
    }

    return matched_last_line;
  }

  async get_last_monitor_line(complete_file_path, file_name) {
    const last_line = await exec_tail_last_line(
      this.exec_tail_path,
      complete_file_path
    );

    this.update_redis_monitor_line(file_name, last_line);
  }

  async update_redis_monitor_line(file_name, line) {
    await updateRedisLine(this.sme, file_name, line);
  }

  async get_monitor_delta(complete_file_path, last_line) {
    // Gets delta based on last line parsed and cached in redis
    const delta = await exec_monitor_delta(
      this.jobId,
      this.exec_monitor_delta_path,
      [last_line, complete_file_path]
    );

    // Will return null if no new lines detected
    if (delta === null) {
      // Get file's last mod datetime
      const file_mod_datetime = await execLastMod(this.lastModPath, [
        complete_file_path,
      ]);

      await log("warn", this.jobId, this.sme, "get_monitor_delta", "FN CALL", {
        message: "File does not have new data",
        last_mod: file_mod_datetime,
      });
      return null;
    }
    return delta.toString();
  }

  // Logcurrent.log
}

module.exports = PHILIPS_MRI_MONITORING;

// grep -P -na "2023-01-03\t15:38:35\t0\t00000\t " monitor_magnet_quench.dat | cut -d : -f 1
