const System = require("./System");
const fsp = require("node:fs").promises;
const fs = require("node:fs");
const readline = require("readline");
const {
  getRedisFileSize,
  getCurrentFileSize,
  updateRedisFileSize,
} = require("../redis/redisHelpers");
const execTail = require("../read/exec-tail");
const execLastMod = require("../read/exec-file_last_mod");

class GE_CT_CV_MRI extends System {
  updateSizePath = "./read/sh/readFileSize.sh";
  fileSizePath = "./read/sh/readFileSize.sh";
  tailPath = "./read/sh/tail.sh";
  lastModPath = "./read/sh/get_file_last_mod.sh";

  prev_file_size;
  current_file_size;
  delta;
  file_data;

  constructor(sysConfigData, file_config, job_id, run_log) {
    super(sysConfigData, file_config, job_id, run_log);
    this.complete_file_path = `${sysConfigData.hhm_config.file_path}/${file_config.file_name}`;
  }

  async getRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
    };
    try {
      this.prev_file_size = await getRedisFileSize(
        this.sme,
        this.file_config.file_name
      );
      note.prev_file_size = this.prev_file_size;
      await this.addLogEvent(
        this.I,
        this.run_log,
        "GE_CT_CV_MRI: getRedisFileSize",
        this.det,
        note
      );
    } catch (error) {
      await this.addLogEvent(
        this.E,
        this.run_log,
        "GE_CT_CV_MRI: getRedisFileSize",
        this.cat,
        note,
        error
      );
    }
  }

  async getCurrentFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
    };
    try {
      this.current_file_size = await getCurrentFileSize(
        this.sme,
        this.fileSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.file_config.file_name
      );
      note.current_file_size = this.current_file_size;
      if (!this.current_file_size) {
        note.message = "File not present";
        await this.addLogEvent(
          this.W,
          this.run_log,
          "GE_CT_CV_MRI: getCurrentFileSize",
          this.det,
          note
        );
        return;
      }

      await this.addLogEvent(
        this.I,
        this.run_log,
        "GE_CT_CV_MRI: getCurrentFileSize",
        this.det,
        note
      );
    } catch (error) {
      await this.addLogEvent(
        this.E,
        this.run_log,
        "GE_CT_CV_MRI: getCurrentFileSize",
        this.cat,
        note,
        error
      );
    }
    this.checkFileExists();
    this.getFileSizeDelta();
  }

  checkFileExists() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
    };
    try {
      if (this.current_file_size === null) {
        throw new Error(
          "File not found in directory: " + this.complete_file_path
        );
      }
    } catch (error) {
      this.addLogEvent(
        this.E,
        this.run_log,
        "GE_CT_CV_MRI: checkFileExists",
        this.cat,
        note,
        error
      );
    }
  }

  getFileSizeDelta() {
    this.delta = this.current_file_size - this.prev_file_size;
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
      delta: this.delta,
    };
    this.addLogEvent(
      this.I,
      this.run_log,
      "GE_CT_CV_MRI: getFileSizeDelta",
      this.det,
      note
    );
  }

  async updateRedisFileSize() {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
    };
    try {
      await updateRedisFileSize(
        this.sme,
        this.updateSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.file_config.file_name
      );
    } catch (error) {
      this.addLogEvent(
        this.E,
        this.run_log,
        "GE_CT_CV_MRI: updateRedisFileSize",
        this.cat,
        note,
        error
      );
    }
  }

  async getFileData(type) {
    let note = {
      job_id: this.job_id,
      sme: this.sme,
      file: this.file_config.file_name,
    };
    await this.addLogEvent(
      this.I,
      this.run_log,
      "GE_CT_CV_MRI: getFileData",
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
        // Used by GE CT & MRI
        if (type === "read_file") {
          this.file_data = (
            await fsp.readFile(this.complete_file_path)
          ).toString();
        }
        // Used by GE CV
        if (type === "read_stream") {
          this.file_data = readline.createInterface({
            input: fs.createReadStream(this.complete_file_path),
            crlfDelay: Infinity,
          });
        }

        if (this.delta < 0) {
          note.message = `Delta is negative value: ${this.delta}. Reading entire file.`;
          note.file = this.complete_file_path;
          await this.addLogEvent(
            this.W,
            this.run_log,
            "GE_CT_CV_MRI: getFileData",
            this.det,
            note
          );
        }
        return;
      }

      if (this.prev_file_size > 0) {
        note.delta = this.delta;
        await this.addLogEvent(
          this.I,
          this.run_log,
          "GE_CT_CV_MRI: getFileData",
          this.det,
          note
        );

        // No change in file size measured: don't tail file
        if (this.delta === 0) {
          // Get file's last mod datetime
          const file_mod_datetime = await execLastMod(this.lastModPath, [
            this.complete_file_path,
          ]);
          note.message = `No new file data. Delta: ${this.delta}`;
          note.last_mod = file_mod_datetime;
          await this.addLogEvent(
            this.W,
            this.run_log,
            "GE_CT_CV_MRI: getFileData",
            this.det,
            note
          );
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
      await this.addLogEvent(
        this.E,
        this.run_log,
        "GE_CT_CV_MRI: getFileData",
        this.cat,
        note,
        error
      );
    }
  }
}

module.exports = GE_CT_CV_MRI;
