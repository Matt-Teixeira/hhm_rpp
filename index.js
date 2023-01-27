("use strict");
require("dotenv").config();
const crypto = require("crypto");
const { log } = require("./logger");
const pgPool = require("./db/pg-pool");
const siemens_parser = require("./jobs/Siemens");
const philips_parser = require("./jobs/Philips");
const ge_parser = require("./jobs/GE");

const filePaths = {
  philips: {
    cv_systems: [
      "SME00445",
      "SME00446",
      "SME00782",
      "SME00785",
      "SME00786",
      "SME01227",
      "SME02548",
      "SME02535",
      "SME02552",
      "SME07852",
      "SME07855",
      "SME07860",
      "SME07862",
      "SME08102",
      "SME11259",
      "SME11532",
      "SME11925",
      "SME11927",
      "SME00886",
      "SME00888",
      "SME00892",
      "SME11722",
      //"SME11723", no such file or directory
      //"SME11677", no such file or directory
    ],
    mri_systems: ["SME01138"],
  },
  ge: {
    ct_systems: [
      "SME12444",
      "SME12446",
      "SME12450",
      "SME12445",
      "SME12451",
      "SME12412",
      "SME12413",
      "SME12443",
      "SME00896",
      "SME01091",
      "SME00847",
      "SME01076",
      "SME01430",
      "SME01429",
      "SME01431",
      "SME01432",
      "SME01433",
      "SME01434",
      "SME01176",
      "SME10071",
    ],
    cv_systems: ["SME00865", "SME00498", "SME01442"],
    mri_systems: [
      "SME02524",
      //"SME02583", // +1 mil rows
      "SME12424",
      "SME01123",
      "SME01096",
      "SME01422",
    ],
  },
  siemens: {
    ct_systems: [
      "SME00885",
      "SME00894",
      "SME01092",
      "SME01129",
      "SME00868",
      "SME01112",
      "SME00854",
      "SME00855",
      "SME00871",
    ],
    mri_systems: ["SME01118", "SME01136", "SME08716", "SME01101"],
    cv_systems: ["SME00884", "SME01440", "SME01444"],
  },
};

const crothal_demo = [
  "SME00444", // Phil CV
  "SME00445",
  "SME00446",
  "SME02524",
  "SME07761", // Phil CV
  "SME00782",
  "SME00784", // Phil CV
  "SME00785",
  "SME00786",
  "SME01227",
  "SME02548",
  "SME02583",
  "SME02535",
  "SME02377", // Phil CV
  "SME02378", // Phil CV
  "SME02579", // Phil CV
  "SME02580", // Phil CV
  "SME02552",
  "SME07852",
  "SME07855",
  "SME07860",
  "SME07862",
  "SME07864", // Phil CV
  "SME08102",
  "SME12444",
  "SME12446",
  "SME12450",
  "SME12443",
  "SME12424",
  "SME12413",
  "SME12412",
  "SME12451",
  "SME12445",
];

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

onBoot(filePaths.philips.cv_systems); //...filePaths.siemens.ct_systems, ...filePaths.ge.ct_systems, ...filePaths.ge.cv_systems, ...filePaths.ge.mri_systems

/* 
const determineManufacturer = async (jobId, system) => {
  try {
    await log("info", jobId, system.id, "determineManufacturer", "FN CALL", {
      mod: process.argv[2],
    });
    console.log(system.id);

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

    let queryString =
      "SELECT id, manufacturer, hhm_config, hhm_file_config from systems WHERE hhm_config IS NOT NULL AND modality = $1"; //  AND modality = $1
    let value = [process.argv[2]];

    const system_array = await pgPool.query(queryString, value);

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
