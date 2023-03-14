("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const win10_siemens_ct = require("./win10_siemens_ct");
const win10_siemens_mri = require("./win10_siemens_mri");
const Siemens_10 = require("../../../data_acquisition/Siemens_10");

const win_10_parsers = async (jobId, sysConfigData, fileConfig) => {
  await log("info", jobId, sysConfigData.id, "win_10_parsers", "FN CALL");

  switch (sysConfigData.hhm_config.modality) {
    case "CT":
      const CT_System = new Siemens_10(sysConfigData, fileConfig, jobId);
      await win10_siemens_ct(CT_System);
      break;
    case "CV":
      //await parse_win_10(jobId, sysConfigData, fileConfig);
      break;
    case "MRI":
      const MRI_System = new Siemens_10(sysConfigData, fileConfig, jobId);
      await win10_siemens_mri(MRI_System);
      break;
    default:
      break;
  }

  try {
  } catch (error) {
    await log("error", jobId, sysConfigData.id, "win_10_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = win_10_parsers;
