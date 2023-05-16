("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic");
const phil_mri_rmmu_long = require("./rmmu_long_cryogenic");
const phil_mri_rmmu_magnet = require("./rmmu_magnet");
const phil_rmmu_history = require("./rmmu_history");
const { type_1 } = require("./monitoring");
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
          const System_Logcurrent = new PHILIPS_MRI_LOGCURRENT(
            sysConfigData,
            directory,
            jobId
          );

          await phil_mri_logcurrent(directory, System_Logcurrent);
          break;
        case "rmmu":
          const Rmmu_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu,
            jobId
          );

          await phil_rmmu_history(directory.rmmu, Rmmu_System);
           
          break;
        case "rmmu_short":
          const Rmmu_Short_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_short,
            jobId
          );

          await phil_mri_rmmu_short(directory.rmmu_short, Rmmu_Short_System);
          break;
        case "rmmu_long":
          const Rmmu_Long_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_long,
            jobId
          );
          await phil_mri_rmmu_long(directory.rmmu_long, Rmmu_Long_System);
          break;
        case "rmmu_magnet":
          const Rmmu_Magnet_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_magnet,
            jobId
          );
          await phil_mri_rmmu_magnet(directory.rmmu_magnet, Rmmu_Magnet_System);
          break;
        case "monitoring":
          const System_Monitor = new PHILIPS_MRI_MONITORING(
            jobId,
            sysConfigData
          );

          await type_1(sysConfigData, System_Monitor, directory);

          break;
        default:
          break;
      }
    }
  } catch (error) {
    console.log(error);
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
