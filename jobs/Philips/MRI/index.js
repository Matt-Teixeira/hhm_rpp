("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const phil_mri_logcurrent = require("./logcurrent");
const phil_mri_rmmu_short = require("./rmmu_short_cryogenic");
const phil_mri_rmmu_long = require("./rmmu_long_cryogenic");
const phil_mri_rmmu_magnet = require("./rmmu_magnet");
const phil_rmmu_history = require("./rmmu_history");
const stt_parser = require("./stt");
const { type_1 } = require("./monitoring");
const PHILIPS_MRI_MONITORING = require("../../../data_acquisition/Philips_MRI_Monitor");
const PHILIPS_MRI_LOGCURRENT_STT = require("../../../data_acquisition/Philips_MRI_Logcurrent");
const PHILIPS_MRI_RMMU = require("../../../data_acquisition/Philips_MRI_Rmmu");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

const philips_mri_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
    sme: sysConfigData.id,
  };

  try {
    await addLogEvent(I, run_log, "philips_mri_parsers", cal, note, null);
    await log(
      "info",
      job_id,
      sysConfigData.id,
      "philips_mri_parsers",
      "FN CALL"
    );

    for await (const directory of sysConfigData.hhm_file_config) {
      let dir = Object.keys(directory)[0];
      note.directory = dir;
      await addLogEvent(I, run_log, "philips_mri_parsers", det, note, null);
      switch (dir) {
        case "logcurrent":
          const Logcurrent_System = new PHILIPS_MRI_LOGCURRENT_STT(
            sysConfigData,
            directory,
            job_id,
            run_log,
            dir
          );

          await phil_mri_logcurrent(
            directory,
            Logcurrent_System,
            run_log,
            job_id
          );
          break;

        case "rmmu":
          const Rmmu_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu,
            job_id,
            run_log,
            dir
          );

          await phil_rmmu_history(directory.rmmu, Rmmu_System);

          break;
        case "rmmu_short":
          
          const Rmmu_Short_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_short,
            job_id,
            run_log,
            dir
          );

          await phil_mri_rmmu_short(Rmmu_Short_System);
          break;

        case "rmmu_long":
          const Rmmu_Long_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_long,
            job_id,
            run_log,
            dir
          );
          await phil_mri_rmmu_long(Rmmu_Long_System);
          break;
        
        case "rmmu_magnet":
          console.log("IN RMMU_MAGNET");
          const Rmmu_Magnet_System = new PHILIPS_MRI_RMMU(
            sysConfigData,
            directory.rmmu_magnet,
            job_id,
            run_log,
            dir
          );
          await phil_mri_rmmu_magnet(Rmmu_Magnet_System);
          break;
          
        case "monitoring":
          const System_Monitor = new PHILIPS_MRI_MONITORING(
            job_id,
            sysConfigData,
            run_log
          );

          await type_1(
            System_Monitor,
            directory,
          );

          break;
          /*
        case "stt_magnet":
          const STT_Magnet_System = new PHILIPS_MRI_LOGCURRENT_STT(
            sysConfigData,
            directory,
            job_id,
            run_log,
            dir
          );

          await stt_parser(directory, STT_Magnet_System);
          break;
        default:
          break;
          */
      }
    }
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "philips_mri_parsers", cat, note, error);
    await log(
      "error",
      job_id,
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
