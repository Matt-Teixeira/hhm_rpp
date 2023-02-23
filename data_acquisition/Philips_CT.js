const System = require("./System");
const fs = require("node:fs").promises;
const { log } = require("../logger");
const {
  getRedisFileSize,
  getCurrentFileSize,
  updateRedisFileSize,
} = require("../redis/redisHelpers");
const execTail = require("../read/exec-tail");
const { philips_re } = require("../parse/parsers");

class Philips_CT extends System {
  updateSizePath = "./read/sh/readFileSize.sh";
  fileSizePath = "./read/sh/readFileSize.sh";
  tailPath = "./read/sh/tail.sh";

  prev_file_size;
  current_file_size;
  delta;
  file_data;

  constructor(sysConfigData, fileToParse, jobId) {
    super(sysConfigData, fileToParse, jobId);
  }

  async getRedisFileSize() {
    try {
      this.prev_file_size = await getRedisFileSize(
        this.sme,
        this.fileToParse.file_name
      );
    } catch (error) {
      await log(
        "error",
        this.jobId,
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
    try {
      this.current_file_size = await getCurrentFileSize(
        this.sme,
        this.fileSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.fileToParse.file_name
      );
    } catch (error) {
      await log(
        "error",
        this.jobId,
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
  }

  async updateRedisFileSize() {
    try {
      await updateRedisFileSize(
        this.sme,
        this.updateSizePath,
        this.sysConfigData.hhm_config.file_path,
        this.fileToParse.file_name
      );
    } catch (error) {
      await log(
        "error",
        this.jobId,
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
    try {
      if (
        this.prev_file_size === null ||
        this.prev_file_size === 0 ||
        this.delta < 0
      ) {
        console.log("This needs to be read from file");
        this.file_data = (
          await fs.readFile(this.complete_file_path)
        ).toString();
        return;
      }

      if (this.prev_file_size > 0) {
        await log("info", this.jobId, this.sme, "getFileData", "FN CALL", {
          delta: this.delta,
        });

        if (this.delta === 0) {
          await log("warn", this.jobId, this.sme, "getFileData", "FN CALL", {
            message: "No file data to read. Delta: 0",
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
      await log("error", this.jobId, this.sme, "getFileData_Class", "FN CALL", {
        error,
      });
    }
  }

  getMatchBlocks() {
    return this.file_data.matchAll(philips_re[this.parsers[0]]);
  }
}

module.exports = { Philips_CT };
