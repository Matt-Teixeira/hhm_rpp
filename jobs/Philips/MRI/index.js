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
const PHILIPS_MRI_MONITORING = require("../../../data_acquisition/Philips_MRI_Monitor");
const PHILIPS_MRI_LOGCURRENT = require("../../../data_acquisition/Philips_MRI_Logcurrent");
const PHILIPS_MRI_RMMU = require("../../../data_acquisition/Philips_MRI_Rmmu");

const philips_mri_parsers = async (jobId, sysConfigData) => {
  try {
    await log(
      "info",
      jobId,
      sysConfigData.id,
      "philips_mri_parsers",
      "FN CALL"
    );

    for await (const directory of sysConfigData.hhm_file_config) {
      let dir = Object.keys(directory)[0];
      switch (dir) {
        case "logcurrent":
          break;
          const System_Logcurrent = new PHILIPS_MRI_LOGCURRENT(
            sysConfigData,
            directory,
            jobId
          );

          await phil_mri_logcurrent(directory, System_Logcurrent);
          break;
        case "rmmu_short":
          //await phil_mri_rmmu_short(jobId, sysConfigData, file);
          break;
        case "rmmu_long":
          const Rmmu_Long_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_long,
            jobId
          );
          await phil_mri_rmmu_long(jobId, sysConfigData, directory, Rmmu_Long_System);
          break;
        case "rmmu_magnet":
          //await phil_mri_rmmu_magnet(jobId, sysConfigData, file);
          break;
        case "monitoring":
          break;
          const System_Monitor = new PHILIPS_MRI_MONITORING(
            jobId,
            sysConfigData
          );
          const json_data = await phil_mri_monitor_jsonb(
            System_Monitor,
            directory
          );

          if (json_data) {
            await phil_mri_monitor_display(
              System_Monitor.jobId,
              System_Monitor.sysConfigData,
              json_data
            );
          }

          break;
        default:
          break;
      }
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
