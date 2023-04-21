("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const pgPool = require("./db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");

const determineManufacturer = async (jobId, sme) => {
  try {
    let queryString =
      "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE id = $1";
    let value = [sme];
    const sysConfigData = await pgPool.query(queryString, value);

    await log("info", jobId, sme, "determineManufacturer", "FN CALL");

    switch (sysConfigData.rows[0].manufacturer) {
      case "Siemens":
        await siemens_parser(jobId, sysConfigData.rows[0]);
        break;
      case "Philips":
        await philips_parser(jobId, sysConfigData.rows[0]);
        break;
      case "GE":
        await ge_parser(jobId, sysConfigData.rows[0]);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", "NA", "NA", "determineManufacturer", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async (systems_list) => {
  try {
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    console.time();

    for await (const system of systems_list) {
      let jobId = crypto.randomUUID();
      await determineManufacturer(jobId, system);
    }
    console.log("*************** END ***************");
    console.timeEnd();
    return;
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot(['SME15816']); // SME15816 SME01138

/* 
const determineManufacturer = async (jobId, system) => {
  try {
    await log("info", jobId, system.id, "determineManufacturer", "FN CALL", {
      mod: process.argv[2],
    });

    switch (system.manufacturer) {
      case "Siemens":
        await siemens_parser(jobId, system);
        break;
      case "Philips":
        await philips_parser(jobId, system);
        break;
      case "GE":
        await ge_parser(jobId, system);
        break;
      default:
        break;
    }
  } catch (error) {
    await log("error", jobId, system.id, "determineManufacturer", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async () => {
  try {
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    console.time();

    let shell_value = [process.argv[2]];

    const queries = {
      CT: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CT' AND hhm_config->'run_group' = '1'",
      CV: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CV/IR' AND hhm_config->'run_group' = '1'",
      MRI: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '1'",
      phil_cv_hr_24:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CV/IR' AND manufacturer = 'Philips' AND hhm_config->'run_group' = '2'",
      all: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL",
    };

    let queryString = queries[shell_value];

    const system_array = await pgPool.query(queryString);

    for await (const system of system_array.rows) {
      let jobId = crypto.randomUUID();
      await determineManufacturer(jobId, system);
    }
    console.log("*************** END ***************");
    console.timeEnd();
    return;
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot();
 */