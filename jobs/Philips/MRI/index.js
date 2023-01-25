("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic");
const phil_mri_rmmu_long = require("./rmmu_long_cryogenic");
const phil_mri_rmmu_magnet = require("./rmmu_magnet");
const phil_mri_monitor_jsonb = require("./insert_jsonb_data");
const phil_mri_monitor_display = require("./insert_display_data");
const phil_mri_rmmu_history = require("./rmmu_history");

const philips_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log(
      "info",
      jobId,
      sysConfigData.id,
      "philips_mri_parsers",
      "FN CALL"
    );

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "logcurrent":
          await phil_mri_logcurrent(jobId, sysConfigData, file);
          break;
        case "rmmu_short":
          await phil_mri_rmmu_short(jobId, sysConfigData, file);
          break;
        case "rmmu_long":
          await phil_mri_rmmu_long(jobId, sysConfigData, file);
          break;
        case "rmmu_magnet":
          await phil_mri_rmmu_magnet(jobId, sysConfigData, file);
          break;
        default:
          break;
      }
    }

    // Verify that this Phil MRI has a monitoring folder. If so, parse data from it.
   const monitoring_file_path = `${sysConfigData.hhm_config.file_path}/monitoring`;
    let files = await fs.readdir(monitoring_file_path);

    if (files.length > 0) {
      console.log("Has monitoring files");
      const data = await phil_mri_monitor_jsonb(
        jobId,
        monitoring_file_path,
        sysConfigData
      );
      await phil_mri_monitor_display(jobId, sysConfigData, data);
    }
  } catch (error) {
    await log(
      "error",
      jobId,
      sysConfigData,
      "philips_mri_parsers",
      "FN CATCH",
      {
        error: error.message,
      }
    );
  }
};

module.exports = philips_mri_parsers;
