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


/* 
("use strict");
require("dotenv").config({ path: "../../.env" });
const fs = require("node:fs").promises;
const fs1 = require("node:fs"); 

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

const checkForDir = async (dir1, dir2) => {
   
  if (fs1.existsSync(dir1)) {
    console.log("Directory exists.")
  } else {
    fs.mkdir(dir1);
    console.log("Directory created")
  }

  if (fs1.existsSync(dir2)) {
    console.log("Directory exists.")
  } else {
    fs.mkdir(dir2);
    console.log("Directory created")
  }
};

const appendLogData = async (logPath) => {
  const now = new Date().toISOString();
  const fileData = await readLog(logPath);
  const error_groups = await extractErrors(fileData);
  // Check to see if dir exist, make if not. 
  await checkForDir(
    "/home/staging/hhm_rpp/logReader/error_logs",
    "/home/staging/hhm_rpp/logReader/warning_logs"
  );

  for await (let error of error_groups) {
    await fs.writeFile(
      `/home/staging/hhm_rpp/logReader/error_logs/error_log_${now}.txt`,
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
      `/home/staging/hhm_rpp/logReader/warning_logs/warning_log_${now}.txt`,
      warning,
      {
        encoding: "utf8",
        flag: "a+",
      }
    );
  }
};

appendLogData("/home/staging/hhm_rpp/adp.prod.log");

*/