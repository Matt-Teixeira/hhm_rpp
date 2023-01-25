("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const {
  philips_mri_rmmu_magnet_schema,
} = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const {convertDates} = require("../../../utils/dates");

async function phil_mri_rmmu_history(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", jobId, sme, "phil_mri_rmmu_history", "FN CALL");

    

    /* const completeFilePath = await constructFilePath(
      sysConfigData.hhm_config.file_path,
      fileToParse,
      fileToParse.regEx
    ); */

    const fileData = (
      await fs.readFile(
        `${sysConfigData.hhm_config.file_path}/${fileToParse.file}`
      )
    ).toString();

    let matches = fileData.matchAll(philips_re.mri.rmmu_history);

    for await (let match of matches) {
      console.log(match.groups);
      continue;
      convertDates(match.groups, dateTimeVersion);
      const matchData = groupsToArrayObj(sme, match.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, philips_mri_rmmu_magnet_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    await bulkInsert(jobId, dataToArray, sysConfigData, fileToParse);
  } catch (error) {
    await log("error", jobId, sme, "phil_mri_rmmu_history", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_rmmu_history;
