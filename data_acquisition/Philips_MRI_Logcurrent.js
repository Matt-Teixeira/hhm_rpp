const fs = require("node:fs");
const readline = require("readline");
const { log } = require("../logger");
const {
  getRedisFileSize,
  getCurrentFileSize,
  updateRedisFileSize,
} = require("../redis/redisHelpers");
const execTail = require("../read/exec-tail");
const execLastMod = require("../read/exec-file_last_mod");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("../utils/logger/enums");

class PHILIPS_MRI_LOGCURRENT {
  constructor(sysConfigData, file_config, job_id, run_log, file_prop_name) {
    this.sysConfigData = sysConfigData;
    this.file_config = file_config;
    this.job_id = job_id;
    this.run_log = run_log;
    this.sme = this.sysConfigData.id;
    this.complete_file_path = `${sysConfigData.hhm_config.file_path}/${file_config[file_prop_name].file_name}`;
    this.parsers = file_config[file_prop_name].parsers;
    this.file_config_prop_name = file_prop_name;
  }

  updateSizePath = "./read/sh/readFileSize.sh";
  fileSizePath = "./read/sh/readFileSize.sh";
  tailPath = "./read/sh/tail.sh";
  lastModPath = "./read/sh/get_file_last_mod.sh";

  prev_file_size;
  current_file_size;
  delta;
  file_data;

  async getRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config,
    };
    try {
      this.prev_file_size = await getRedisFileSize(
        this.sme,
        this.file_config[this.file_config_prop_name].file_name
      );

      note.prev_file_size = this.prev_file_size;
      await addLogEvent(
        I,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: getRedisFileSize",
        det,
        note,
        null
      );
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: getRedisFileSize",
        cat,
        note,
        error
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "getRedisFileSize_Class",
        "FN CALL",
        {
          error,
        }
      );
    }
  }

  async getCurrentFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config,
    };
    /* console.log(note);
    console.log(this.file_config[this.file_config_prop_name].file_name);
    console.log(this.fileSizePath);
    console.log(this.sysConfigData.hhm_config.file_path); */
    try {
      this.current_file_size = await getCurrentFileSize(
        this.sme,
        this.fileSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.file_config[this.file_config_prop_name].file_name
      );
      note.current_file_size = this.current_file_size;
      console.log(note);
      await addLogEvent(
        I,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: getCurrentFileSize",
        det,
        note,
        null
      );
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: getCurrentFileSize",
        cat,
        note,
        error
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "getCurrentFileSize_Class",
        "FN CALL",
        {
          error,
        }
      );
    }
    this.checkFileExists();
    this.getFileSizeDelta();
  }

  checkFileExists() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config[this.file_config_prop_name].file_name,
    };
    try {
      if (this.current_file_size === null) {
        throw new Error(
          "File not found in directory: " + this.complete_file_path
        );
      }
    } catch (error) {
      addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: checkFileExists",
        cat,
        note,
        error
      );
    }
  }

  getFileSizeDelta() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config[this.file_config_prop_name].file_name,
    };
    console.log("Getting DELTA")
    
    this.delta = this.current_file_size - this.prev_file_size;
    note.delta = this.delta;
    console.log(this.delta)
    addLogEvent(
      I,
      this.run_log,
      "PHILIPS_MRI_LOGCURRENT: getFileSizeDelta",
      det,
      note,
      null
    );
  }

  async updateRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config[this.file_config_prop_name].file_name,
    };
    try {
      await updateRedisFileSize(
        this.sme,
        this.updateSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.file_config[this.file_config_prop_name].file_name
      );
    } catch (error) {
      addLogEvent(
        I,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: updateRedisFileSize",
        cat,
        note,
        error
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "updateRedisFileSize_Class",
        "FN CALL",
        {
          error,
        }
      );
    }
  }

  async getFileData() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config[this.file_config_prop_name].file_name
    };
    console.log("\nGet File Data Note");
    console.log(this.delta);
    try {
      if (
        this.prev_file_size === null ||
        this.prev_file_size === 0 ||
        this.delta < 0
      ) {
        this.file_data = readline.createInterface({
          input: fs.createReadStream(this.complete_file_path),
          crlfDelay: Infinity,
        });
        if (this.delta < 0) {
          note.message = `Delta was a negative value: ${this.delta}`;
          await addLogEvent(
            I,
            this.run_log,
            "PHILIPS_MRI_LOGCURRENT: getFileData",
            det,
            note,
            null
          );
          await log("error", this.job_id, this.sme, "getFileData", "FN CALL", {
            message: `Delta was a negative value: ${this.delta}`,
            file: this.complete_file_path,
          });
        }
        return;
      }

      if (this.prev_file_size > 0) {
        note.delta = this.delta;
        await addLogEvent(
          I,
          this.run_log,
          "PHILIPS_MRI_LOGCURRENT: getFileData",
          det,
          note,
          null
        );
        await log("info", this.job_id, this.sme, "getFileData", "FN CALL", {
          delta: this.delta,
        });

        if (this.delta === 0) {
          // Get file's last mod datetime
          const file_mod_datetime = await execLastMod(this.lastModPath, [
            this.complete_file_path,
          ]);
          note.message = `No file data to read. Delta: ${this.delta}`;
          note.last_mod = file_mod_datetime;
          await addLogEvent(
            I,
            this.run_log,
            "PHILIPS_MRI_LOGCURRENT: getFileData",
            det,
            note,
            null
          );
          await log("warn", this.job_id, this.sme, "getFileData", "FN CALL", {
            message: `No file data to read. Delta: ${this.delta}`,
            last_mod: file_mod_datetime,
          });
          this.file_data = null;
          return;
        }

        const tailDelta = await execTail(
          this.tailPath,
          this.delta,
          this.complete_file_path
        );

        // Place file data back into a format in which it can be read line by line. In this case, an array
        this.file_data = tailDelta.toString().split(/(?:\r\n|\r|\n)/g);
        return;
      }
    } catch (error) {
      await addLogEvent(
        E,
        this.run_log,
        "PHILIPS_MRI_LOGCURRENT: getFileData",
        det,
        note,
        error
      );
      await log(
        "error",
        this.job_id,
        this.sme,
        "getFileData_Class",
        "FN CALL",
        {
          error,
        }
      );
    }
  }
}

module.exports = PHILIPS_MRI_LOGCURRENT;
