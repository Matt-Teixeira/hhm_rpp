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

  async get_all_monitor_data(directory) {
    for await (const file of directory.monitoring) {
      const complete_file_path = `${this.sysConfigData.hhm_config.file_path}/${file.file_name}`;
      console.log(complete_file_path);
      const fileData = (await fs.readFile(complete_file_path)).toString();
      return;
    }
  }

  async get_redis_line(file) {
    let last_line = await getRedisLine(this.sme, file.file_name);
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
    return (await exec_monitor_delta(this.jobId, this.exec_monitor_delta_path, [
      last_line,
      complete_file_path,
    ])).toString();
  }
}

module.exports = PHILIPS_MRI;

// grep -P -na "2023-01-03\t15:38:35\t0\t00000\t " monitor_magnet_quench.dat | cut -d : -f 1

/* 
2022-12-31	15:19:03	0	00000	 
2023-01-01	15:20:50	0	00000	 
2023-01-02	15:32:12	0	00000	 
2023-01-03	15:38:35	0	00000	 
2023-01-03	15:40:35	0	00000	  

*/
