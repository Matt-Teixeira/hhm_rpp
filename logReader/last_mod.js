("use strict");
require("dotenv").config({ path: "../../.env" });
const fsp = require("node:fs").promises;
const fs = require("node:fs")

const readLog = async (logPath) => {
  const fileData = (await fsp.readFile(logPath)).toString();
  return fileData;
};

const extract_last_mod = async (fileData) => {
  const mod_groups = fileData.matchAll(
    /\[(?<capture_time>\d{4}-\d{2}-.*?)\].*\n?.*\n?.*\n\[last_mod\].*?(?<mod_time>[A-Z]{1}[a-z]{2}\s+\d+\s\d{2}:\d{2}.*)/g
  );
  return mod_groups;
};

const appendLogData = async (logPath) => {
    const target_directory = '/home/matt-teixeira/hep3/hhm_rpp/logReader/last_mod';
  try {
    const now = new Date().toISOString();
    const fileData = await readLog(logPath);
    const mod_groups = await extract_last_mod(fileData);

    if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, error => error ? console.log(error) : console.log('You have created the target_directory') ) ;
    }

    if (mod_groups) {
      for await (const match of mod_groups) {
        let str = `LAST UPDATED: ${match.groups.mod_time}\n`;
        await fsp.writeFile(
          `/home/matt-teixeira/hep3/hhm_rpp/logReader/last_mod/mod_log_${now}.txt`,
          str,
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
const fs = require("node:fs")

const readLog = async (logPath) => {
  const fileData = (await fsp.readFile(logPath)).toString();
  return fileData;
};

const extract_last_mod = async (fileData) => {
  const mod_groups = fileData.matchAll(
    /\[(?<capture_time>\d{4}-\d{2}-.*?)\].*\n?.*\n?.*\n\[last_mod\].*?(?<mod_time>[A-Z]{1}[a-z]{2}\s+\d+\s\d{2}:\d{2}.*)/g
  );
  return mod_groups;
};

const appendLogData = async (logPath) => {
    const target_directory = '/home/staging/hhm_rpp/logReader/last_mod';
  try {
    const now = new Date().toISOString();
    const fileData = await readLog(logPath);
    const mod_groups = await extract_last_mod(fileData);

    if (!fs.existsSync(target_directory)) {
        fs.mkdir(target_directory, error => error ? console.log(error) : console.log('You have created the target_directory') ) ;
    }

    if (mod_groups) {
      for await (const match of mod_groups) {
        let obj = JSON.stringify(match.groups)
        await fsp.writeFile(
          `/home/staging/hhm_rpp/logReader/last_mod/mod_log_${now}.txt`,
          obj + ",\n",
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