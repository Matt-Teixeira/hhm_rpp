const fsp = require("node:fs").promises;
const { log } = require("../logger");
const exec_move_to_archive = require("../read/exec-move_to_archive");
const {
  update_redis_last_file,
  get_last_cached_file,
} = require("../redis/philips_monitoring");
const execLastMod = require("../read/exec-file_last_mod");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("../utils/logger/enums");

// sysConfigData, file_config, job_id, run_log, file_prop_name
class PHILIPS_MRI_RMMU {
  constructor(sysConfigData, file_config, job_id, run_log, file_prop_name) {
    this.sysConfigData = sysConfigData;
    this.file_config = file_config;
    this.job_id = job_id;
    this.run_log = run_log;
    this.sme = this.sysConfigData.id;
    this.directory_path = `${sysConfigData.hhm_config.file_path}/${file_config.query}`;
    this.parsers = file_config.parsers;
    this.file_config_prop_name = file_prop_name;
  }

  files_in_dir = [];
  last_file_parsed;
  last_file_in_dir;

  exec_archive_path = "./read/sh/move_to_archive.sh";

  async get_directory_files() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config,
    };
    await addLogEvent(
      I,
      this.run_log,
      "PHILIPS_MRI_RMMU: get_directory_files",
      cal,
      note,
      null
    );
    try {
      // Ex directory_path: Files in  /opt/hhm-files/C0137/SHIP013/SME01138/rmmu_long
      this.files_in_dir = await fsp.readdir(this.directory_path);
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_RMMU: get_directory_files",
        cat,
        note,
        error
      );
    }
  }

  /*    No longer use with new data acquisition 
async read_files() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
    };
    await addLogEvent(
      I,
      this.run_log,
      "PHILIPS_MRI_RMMU: read_files",
      cal,
      note,
      null
    );
    try {
      for await (const file of this.files_in_dir) {
        const complete_file_path = `${this.directory_path}/${file}`;

        const fileData = (await fsp.readFile(complete_file_path)).toString();
      }
    } catch (error) {
      await log(
        "error",
        this.job_id,
        this.sme,
        "rmmu_class_read_files",
        "FN CALL",
        { error }
      );
    }
  } */

  /*  No longer use with new data acquisition 
async archive_file(complete_file_path) {
    const archive_file_path = `${this.sysConfigData.hhm_config.file_path}/archive`;

    await exec_move_to_archive(this.job_id, this.sme, this.exec_archive_path, [
      complete_file_path,
      archive_file_path,
    ]);
  } 
  */

  // RMMU FILE DIRECTORY PROCESS

  // Set last file in rmmu directory
  async update_files_to_process() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
    };
    try {
      const index = this.files_in_dir.indexOf(this.last_file_parsed);
      this.files_in_dir = this.files_in_dir.slice(index + 1);
      this.last_file_in_dir = this.files_in_dir[this.files_in_dir.length - 1];
      note.last_file_in_dir = this.last_file_in_dir;
      await addLogEvent(
        I,
        this.run_log,
        "PHILIPS_MRI_RMMU: update_files_to_process",
        det,
        note,
        null
      );
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_RMMU: update_files_to_process",
        cat,
        note,
        error
      );
    }
  }

  async cache_last_file_name(file, rmmu_file_type) {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file,
      rmmu_file_type,
    };
    await addLogEvent(
      I,
      this.run_log,
      "PHILIPS_MRI_RMMU: cache_last_file_name",
      cal,
      note,
      null
    );
    try {
      await update_redis_last_file(this.sme, file, rmmu_file_type);
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_RMMU: cache_last_file_name",
        cat,
        note,
        error
      );
    }
  }

  async get_last_file_parsed(rmmu_file_type) {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      rmmu_file_type,
      last_file_parsed: this.last_file_parsed,
    };
    await addLogEvent(
      I,
      this.run_log,
      "PHILIPS_MRI_RMMU: get_last_file_parsed",
      cal,
      note,
      null
    );
    try {
      this.last_file_parsed = await get_last_cached_file(
        this.sme,
        rmmu_file_type
      );
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_RMMU: get_last_file_parsed",
        cat,
        note,
        error
      );
    }
  }
}

module.exports = PHILIPS_MRI_RMMU;
