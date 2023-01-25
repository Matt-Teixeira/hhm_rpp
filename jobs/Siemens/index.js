("use strict");
require("dotenv").config();
const { log } = require("../../logger");
const fs = require("node:fs").promises;
const win_10_parsers = require("./win_10/index.js");
const win_7_parsers = require("./win_7/index");

const determineOsVersion = async (jobId, sysConfigData) => {
  await log("info", jobId, sysConfigData.id, "determineOsVersion", "FN CALL");

  const fileConfigs = sysConfigData.hhm_file_config;

  switch (sysConfigData.hhm_config.windowsVersion) {
    case "win_7":
      for await (let fileConfig of fileConfigs) {
        await win_7_parsers(jobId, sysConfigData, fileConfig);
      }
      break;
    case "win_10":
      for await (let fileConfig of fileConfigs) {
        await win_10_parsers(jobId, sysConfigData, fileConfig);
      }
      break;
    default:
      break;
  }

  try {
  } catch (error) {
    await log(
      "error",
      jobId,
      sysConfigData.id,
      "determineOsVersion",
      "FN CATCH",
      {
        error: error,
      }
    );
  }
};

module.exports = determineOsVersion;

/* const parsed_data = await parse_win_10(filePath);
    console.log(parsed_data);
    if (parsed_data === undefined) {
      await parse_win_7(filePath);
    } */
