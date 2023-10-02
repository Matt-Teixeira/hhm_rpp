("use strict");
require("dotenv").config();
const pgPool = require("./utils/db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");
const queries = require("./data_acquisition/on_boot_queries");
const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog
] = require("./utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("./utils/logger/enums");
const { v4: uuidv4 } = require("uuid");

const determineManufacturer = async (job_id, system, run_log) => {
  let note = {
    job_id: job_id,
    sme: system.id
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
    argv: process.argv
  };

  try {
    await addLogEvent(I, run_log, "onBoot", cal, note, null);
    console.time();

    let shell_value = [process.argv[2]];

    let queryString = queries[shell_value];

    const system_array = await pgPool.any(queryString);
    console.log(system_array);

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
