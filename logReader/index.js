("use strict");
require("dotenv").config({ path: "../../.env" });
const fsp = require("node:fs").promises;
const fs = require("node:fs");

const readLog = async (logPath) => {
  const fileData = (await fsp.readFile(logPath)).toString();
  return fileData;
};

const extractErrors = async (fileData) => {
  const error_groups = fileData.match(/(?<error>\[ERROR.*?)\s\n/gs);
  return error_groups;
};

const extractWarnings = async (fileData) => {
  const warning_groups = fileData.match(/(?<warning>\[WARN.*?)\s\n/gs);
  return warning_groups;
};

const appendLogData = async (logPath) => {
  try {
    const now = new Date().toISOString();
    const fileData = await readLog(logPath);
    const error_groups = await extractErrors(fileData);
    if (error_groups) {
      const target_directory =
        "/home/matt-teixeira/hep3/hhm_rpp/logReader/error_logs";
      if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, (error) =>
          error
            ? console.log(error)
            : console.log("You have created the target_directory")
        );
      }
      for await (let error of error_groups) {
        await fsp.writeFile(
          `/home/matt-teixeira/hep3/hhm_rpp/logReader/error_logs/error_log_${now}.txt`,
          error,
          {
            encoding: "utf8",
            flag: "a+",
          }
        );
      }
    }

    const warning_groups = await extractWarnings(fileData);

    if (warning_groups) {
      const target_directory =
        "/home/matt-teixeira/hep3/hhm_rpp/logReader/warning_logs";
      if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, (error) =>
          error
            ? console.log(error)
            : console.log("You have created the target_directory")
        );
      }
      for await (let warning of warning_groups) {
        await fsp.writeFile(
          `/home/matt-teixeira/hep3/hhm_rpp/logReader/warning_logs/warning_log_${now}.txt`,
          warning,
          {
            encoding: "utf8",
            flag: "a+",
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

appendLogData("/home/matt-teixeira/hep3/hhm_rpp/adp.prod.log");

// STAGING SETUP
/* 
("use strict");
require("dotenv").config({ path: "../../.env" });
const fsp = require("node:fs").promises;
const fs = require("node:fs");

const readLog = async (logPath) => {
  const fileData = (await fsp.readFile(logPath)).toString();
  return fileData;
};

const extractErrors = async (fileData) => {
  const error_groups = fileData.match(/(?<error>\[ERROR.*?)\s\n/gs);
  return error_groups;
};

const extractWarnings = async (fileData) => {
  const warning_groups = fileData.match(/(?<warning>\[WARN.*?)\s\n/gs);
  return warning_groups;
};

const appendLogData = async (logPath) => {
  try {
    const now = new Date().toISOString();
    const fileData = await readLog(logPath);
    const error_groups = await extractErrors(fileData);
    if (error_groups) {
      const target_directory =
        "/home/staging/hhm_rpp/logReader/error_logs";
      if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, (error) =>
          error
            ? console.log(error)
            : console.log("You have created the target_directory")
        );
      }
      for await (let error of error_groups) {
        await fsp.writeFile(
          `/home/staging/hhm_rpp/logReader/error_logs/error_log_${now}.txt`,
          error,
          {
            encoding: "utf8",
            flag: "a+",
          }
        );
      }
    }

    const warning_groups = await extractWarnings(fileData);

    if (warning_groups) {
      const target_directory =
        "/home/staging/hhm_rpp/logReader/warning_logs";
      if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, (error) =>
          error
            ? console.log(error)
            : console.log("You have created the target_directory")
        );
      }
      for await (let warning of warning_groups) {
        await fsp.writeFile(
          `/home/staging/hhm_rpp/logReader/warning_logs/warning_log_${now}.txt`,
          warning,
          {
            encoding: "utf8",
            flag: "a+",
          }
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

appendLogData("/home/staging/hhm_rpp/adp.prod.log");
*/
