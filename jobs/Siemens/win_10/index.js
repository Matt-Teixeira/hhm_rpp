("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const parse_win_10 = require("./windows_10");
const win10_siemens_ct = require("./win10_siemens_ct")
const win10_siemens_mri = require("./win10_siemens_mri")

const win_10_parsers = async (jobId, sysConfigData, fileConfig) => {
  await log("info", jobId, sysConfigData.id, "win_10_parsers", "FN CALL");

  switch (sysConfigData.hhm_config.modality) {
    case "CT":
      await win10_siemens_ct(jobId, sysConfigData, fileConfig);
      break;
      case "CV":
      //await parse_win_10(jobId, sysConfigData, fileConfig);
      break;
      case "MRI":
      await win10_siemens_mri(jobId, sysConfigData, fileConfig);
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
