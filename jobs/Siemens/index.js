const win_10_parsers = require("./win_10/index.js");
const win_7_parsers = require("./win_7/index");
const [addLogEvent] = require("../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../utils/logger/enums");

const determineOsVersion = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id,
    sme: sysConfigData.id,
  };
  await addLogEvent(I, run_log, "determineOsVersion", cal, note, null);

  // Check for windows OS version

  const fileConfigs = sysConfigData.hhm_file_config;

  switch (sysConfigData.hhm_config.windowsVersion) {
    case "win_7":
      for await (let fileConfig of fileConfigs) {
        await win_7_parsers(job_id, sysConfigData, fileConfig, run_log);
      }
      break;
    case "win_10":
      for await (let fileConfig of fileConfigs) {
        await win_10_parsers(job_id, sysConfigData, fileConfig, run_log);
      }
      break;
    default:
      break;
  }

  try {
  } catch (error) {
    await addLogEvent(E, run_log, "determineOsVersion", cat, note, error);
  }
};

module.exports = determineOsVersion;
