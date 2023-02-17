const { log } = require("../logger");
const fs = require("node:fs").promises;
const {
  getRedisLine,
  updateRedisLine,
} = require("../redis/philips_monitoring");
const exec_tail_last_line = require("../read/exec-tail-last-line");
const exec_monitor_delta = require("../read/exec-monitor_delta");

class PHILIPS_MRI {
  constructor(jobId, sysConfigData) {
    (this.jobId = jobId), (this.sysConfigData = sysConfigData);
    this.sme = this.sysConfigData.id;
  }

  exec_tail_path = "./read/sh/tail_late_line.sh";
  exec_monitor_delta_path = "./read/sh/get_monitor_delta.sh";

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

    last_line = last_line.match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}/)[0];
    return last_line;
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
    const delta = await exec_monitor_delta(
      this.jobId,
      this.exec_monitor_delta_path,
      [last_line, complete_file_path]
    );

    if (delta === null) {
      await log("warn", this.jobId, this.sme, "get_monitor_delta", "FN CALL", {
        message: "File does not have new data",
        file: complete_file_path,
      });
      return null;
    }
    return delta.toString();
  }
}

module.exports = PHILIPS_MRI;

// grep -P -na "2023-01-03\t15:38:35\t0\t00000\t " monitor_magnet_quench.dat | cut -d : -f 1

/* 
magnet_quench
2022-12-30	15:05:31	0	00000	 
2022-12-31	15:19:03	0	00000	 
2023-01-01	15:20:50	0	00000	 
2023-01-02	15:32:12	0	00000	 
2023-01-03	15:38:35	0	00000	 

magnet_pressure
2022-12-30	15:05:29	0
2022-12-31	15:19:02	0
2023-01-01	15:20:49	0
2023-01-02	15:32:11	0
2023-01-03	15:38:33	0

*/
