("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const pgPool = require("./utils/db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog,
] = require("./utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("./utils/logger/enums");
const { v4: uuidv4 } = require("uuid");

/* 
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
    process.exit();
  } catch (error) {
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot([
  "SME01142",
  "SME01399",
  "SME01402",
  "SME01403",
  "SME01404",
  "SME01405",
  "SME01406",
  "SME01424",
  "SME08284",
  "SME08285",
  "SME10234",
]); // "SME10234", "SME01142"
 */

const determineManufacturer = async (job_id, system, run_log) => {
  let note = {
    job_id: job_id,
    sme: system.id,
  };
  try {
    await addLogEvent(I, run_log, "determineManufacturer", cal, note, null);
    await log("info", job_id, system.id, "determineManufacturer", "FN CALL", {
      mod: process.argv[2],
    });

    switch (system.manufacturer) {
      case "Siemens":
        await siemens_parser(job_id, system, run_log);
        break;
      case "Philips":
        await philips_parser(job_id, system, run_log);
        break;
      case "GE":
        await ge_parser(job_id, system, run_log);
        break;
      default:
        break;
    }
  } catch (error) {
    await addLogEvent(E, run_log, "determineManufacturer", cat, note, error);
    await log("error", job_id, system.id, "determineManufacturer", "FN CATCH", {
      error: error,
    });
  }
};

const onBoot = async () => {
  const run_log = await makeAppRunLog();

  let note = {
    LOGGER: process.env.LOGGER,
    REDIS_IP: process.env.REDIS_IP,
    PG_USER: process.env.PG_USER,
    PG_DB: process.env.PG_DB,
    argv: process.argv,
  };

  try {
    await addLogEvent(I, run_log, "onBoot", cal, note, null);
    await log("info", "NA", "NA", "onBoot", `FN CALL`);
    console.time();

    let shell_value = [process.argv[2]];

    const queries = {
      CT: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality LIKE '%CT' AND hhm_config->'run_group' = '1'",
      CV: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CV/IR' AND hhm_config->'run_group' = '1'",
      MRI: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '1'",
      phil_cv_hr_24:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CV/IR' AND manufacturer = 'Philips' AND hhm_config->'run_group' = '2'",
      all: "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL",
    };

    let queryString = queries[shell_value];

    const system_array = await pgPool.any(queryString);
    /* 
    const child_processes = [];
    for await (const system of system_array) {
      let jobId = crypto.randomUUID();
      child_processes.push(
        async () => await determineManufacturer(jobId, system, run_log)
      );
    }

    // CREATE AN ARRAY OF PROMISES BY CALLING EACH child_process FUNCTION
    const promises = child_processes.map((child_process) => child_process());

    // AWAIT PROMISIS
    await Promise.all(promises);
 */

    for await (const system of system_array) {
      const job_id = uuidv4();

      await determineManufacturer(job_id, system, run_log);
    }

    await writeLogEvents(run_log);

    console.log("\n*************** END ***************");
    console.timeEnd();

    process.exit();
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "onBoot", cat, null, error);
    await log("error", "NA", "NA", "onBoot", "FN CATCH", {
      error: error,
    });
  }
};

onBoot();
