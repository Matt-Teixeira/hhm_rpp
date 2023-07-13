const fsp = require("node:fs").promises;
const { log } = require("../logger");
const exec_move_to_archive = require("../read/exec-move_to_archive");
const {
  update_redis_last_file,
  get_last_cached_file,
} = require("../redis/philips_monitoring");
const execLastMod = require("../read/exec-file_last_mod");

class PHILIPS_MRI_RMMU {
  constructor(sysConfigData, fileToParse, jobId) {
    (this.sysConfigData = sysConfigData),
      (this.fileToParse = fileToParse),
      (this.jobId = jobId);
    this.sme = this.sysConfigData.id;
    this.directory_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.query}`;
    this.parsers = fileToParse.parsers;
  }

  files_in_dir = [];
  last_file_parsed;
  last_file_in_dir;

  exec_archive_path = "./read/sh/move_to_archive.sh";

  async get_directory_files() {
    try {
      // Ex directory_path: /opt/hhm-files/C0137/SHIP013/SME01138/rmmu_long
      this.files_in_dir = await fsp.readdir(this.directory_path);
    } catch (error) {
      await log(
        "error",
        this.jobId,
        this.sme,
        "rmmu_class_get_directory_files",
        "FN CALL",
        { error }
      );
    }
  }

  async read_files() {
    try {
      for await (const file of this.files_in_dir) {
        const complete_file_path = `${this.directory_path}/${file}`;

        const fileData = (await fsp.readFile(complete_file_path)).toString();
      }
    } catch (error) {
      await log(
        "error",
        this.jobId,
        this.sme,
        "rmmu_class_read_files",
        "FN CALL",
        { error }
      );
    }
  }

  async archive_file(complete_file_path) {
    const archive_file_path = `${this.sysConfigData.hhm_config.file_path}/archive`;

    await exec_move_to_archive(this.jobId, this.sme, this.exec_archive_path, [
      complete_file_path,
      archive_file_path,
    ]);
  }
  // RMMU FILE DIRECTORY PROCESS

  // Set last file in rmmu directory
  update_files_to_process() {
    const index = this.files_in_dir.indexOf(this.last_file_parsed);
    this.files_in_dir = this.files_in_dir.slice(index + 1);
    this.last_file_in_dir = this.files_in_dir[this.files_in_dir.length - 1];
  }

  async cache_last_file_name(file, rmmu_file_type) {
    await update_redis_last_file(this.sme, file, rmmu_file_type);
  }

  async get_last_file_parsed(rmmu_file_type) {

    this.last_file_parsed = await get_last_cached_file(this.sme, rmmu_file_type);
  }
}

module.exports = PHILIPS_MRI_RMMU;
