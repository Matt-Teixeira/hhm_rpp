const System = require("./System");
const fs = require("node:fs").promises;
const { log } = require("../logger");
const {
  getRedisFileSize,
  getCurrentFileSize,
  updateRedisFileSize,
} = require("../redis/redisHelpers");
const execTail = require("../read/exec-tail");
const execLastMod = require("../read/exec-file_last_mod");
const { philips_re } = require("../parse/parsers");

class Philips_CT extends System {
  updateSizePath = "./read/sh/readFileSize.sh";
  fileSizePath = "./read/sh/readFileSize.sh";
  tailPath = "./read/sh/tail.sh";
  lastModPath = "./read/sh/get_file_last_mod.sh";

  prev_file_size;
  current_file_size;
  delta;
  file_data;

  constructor(sysConfigData, fileToParse, job_id, run_log) {
    super(sysConfigData, fileToParse, job_id, run_log);
  }

  async getRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.fileToParse.file_name,
    };
    try {
      this.prev_file_size = await getRedisFileSize(
        this.sme,
        this.fileToParse.file_name
      );
      note.prev_file_size = this.prev_file_size;
      await System.addLogEvent(
        this.I,
        this.run_log,
        "Philips_CT: getRedisFileSize",
        this.det,
        note
      );
    } catch (error) {
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Philips_CT: getRedisFileSize",
        this.cat,
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
      file: this.fileToParse.file_name,
    };
    try {
      this.current_file_size = await getCurrentFileSize(
        this.sme,
        this.fileSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.fileToParse.file_name
      );
      note.current_file_size = this.current_file_size;
      await System.addLogEvent(
        this.I,
        this.run_log,
        "Philips_CT: getCurrentFileSize",
        this.det,
        note
      );
    } catch (error) {
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Philips_CT: getCurrentFileSize",
        this.cat,
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

  getFileSizeDelta() {
    this.delta = this.current_file_size - this.prev_file_size;

    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.fileToParse.file_name,
      delta: this.delta,
    };
    System.addLogEvent(
      this.I,
      this.run_log,
      "Philips_CT: getFileSizeDelta",
      this.det,
      note
    );
  }

  async updateRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.fileToParse.file_name,
    };
    try {
      await updateRedisFileSize(
        this.sme,
        this.updateSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.fileToParse.file_name
      );
    } catch (error) {
      System.addLogEvent(
        this.E,
        this.run_log,
        "Philips_CT: updateRedisFileSize",
        this.cat,
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
      file: this.fileToParse.file_name,
    };
    await System.addLogEvent(
      this.I,
      this.run_log,
      "Philips_CT: getFileData",
      this.cal,
      note
    );
    try {
      // prev_file_size = null: no entry in redis
      // prev_file_size = 0: rotated cache and file (reset)
      // delta < 0: File has rotated without prior knowledge and is now smaller than previous
      if (
        this.prev_file_size === null ||
        this.prev_file_size === 0 ||
        this.delta < 0
      ) {
        this.file_data = (
          await fs.readFile(this.complete_file_path)
        ).toString();
        if (this.delta < 0) {
          note.message = `Delta is negative value: ${this.delta}. Reading entire file.`;
          note.file = this.complete_file_path;
          await System.addLogEvent(
            this.W,
            this.run_log,
            "Philips_CT: getFileData",
            this.det,
            note
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
        await System.addLogEvent(
          this.I,
          this.run_log,
          "Philips_CT: getFileData",
          this.det,
          note
        );
        await log("info", this.job_id, this.sme, "getFileData", "FN CALL", {
          delta: this.delta,
        });

        if (this.delta === 0) {
          // Get file's last mod datetime
          const file_mod_datetime = await execLastMod(this.lastModPath, [
            this.complete_file_path,
          ]);
          note.message = `No new file data. Delta: ${this.delta}`;
          note.last_mod = file_mod_datetime;
          await System.addLogEvent(
            this.W,
            this.run_log,
            "Philips_CT: getFileData",
            this.det,
            note
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

        this.file_data = tailDelta.toString();
        return;
      }
    } catch (error) {
      await System.addLogEvent(
        this.E,
        this.run_log,
        "Philips_CT: getFileData",
        this.cat,
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

  getMatchBlocks() {
    return this.file_data.matchAll(philips_re[this.parsers[0]]);
  }
}

module.exports = { Philips_CT };
