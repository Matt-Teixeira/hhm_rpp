("use strict");
require("dotenv").config();
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

const determineManufacturer = async (job_id, system, run_log) => {
  let note = {
    job_id: job_id,
    sme: system.id,
  };
  try {
    await addLogEvent(I, run_log, "determineManufacturer", cal, note, null);

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
    console.time();

    let shell_value = [process.argv[2]];
    const queries = {
      GE_CT:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT null AND manufacturer = 'GE' AND modality LIKE '%CT' AND hhm_config->'run_group' = '1'",
      GE_CV:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND manufacturer = 'GE' AND modality = 'CV/IR' AND hhm_config->'run_group' = '1'",
      GE_MRI:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND manufacturer = 'GE' AND modality = 'MRI' AND hhm_config->'run_group' = '1'",
      PHILIPS_CT:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND manufacturer = 'Philips' AND modality LIKE '%CT' AND hhm_config->'run_group' = '1'",
      PHILIPS_CV:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'CV/IR' AND manufacturer = 'Philips' AND hhm_config->'run_group' = '2'",
      PHILIPS_MRI_1:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '1' AND manufacturer = 'Philips'",
      PHILIPS_MRI_2:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '2' AND manufacturer = 'Philips'",
      PHILIPS_MRI_3:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '3' AND manufacturer = 'Philips'",
      PHILIPS_MRI_4:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '4' AND manufacturer = 'Philips'",
      PHILIPS_MRI_5:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = 'MRI' AND hhm_config->'run_group' = '5' AND manufacturer = 'Philips'",
      SIEMENS_CT:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND manufacturer = 'Siemens' AND modality LIKE '%CT' AND hhm_config->'run_group' = '1'",
      SIEMENS_MRI:
        "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND manufacturer = 'Siemens' AND modality = 'MRI' AND hhm_config->'run_group' = '1'",
      NORM: `
      SELECT *
      FROM config.process_config pc
      INNER JOIN config.mag mag
      ON pc.system_id = mag.system_id
      `,
    };

    let queryString = queries[shell_value];

    const system_array = await pgPool.any(queryString);

    /* 
    const child_processes = [];
    for await (const system of system_array) {
      const job_id = uuidv4();
      child_processes.push(
        async () => await determineManufacturer(job_id, system, run_log)
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
  }
};

onBoot();
