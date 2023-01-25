("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;

const readLog = async (logPath) => {
  const fileData = (await fs.readFile(logPath)).toString();
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
  const now = new Date().toISOString();
  const fileData = await readLog(logPath);
  const error_groups = await extractErrors(fileData);
  for await (let error of error_groups) {
    await fs.writeFile(
      `/home/matt-teixeira/hep3/hhm_parsers/Parsers/logReader/error_logs/error_log_${now}.txt`,
      error,
      {
        encoding: "utf8",
        flag: "a+",
      }
    );
  }
  const warning_groups = await extractWarnings(fileData);

  for await (let warning of warning_groups) {
    await fs.writeFile(
      `/home/matt-teixeira/hep3/hhm_parsers/Parsers/logReader/warning_logs/warning_log_${now}.txt`,
      warning,
      {
        encoding: "utf8",
        flag: "a+",
      }
    );
  }
};

appendLogData("/home/matt-teixeira/hep3/hhm_parsers/Parsers/adp.prod.log");
