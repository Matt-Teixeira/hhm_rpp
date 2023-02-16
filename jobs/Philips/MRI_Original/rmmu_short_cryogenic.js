("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { phil_mri_rmmu_short_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const {convertDates} = require("../../../utils/dates");
const constructFilePath = require("../../../utils/constructFilePath");
const {
  isFileModified,
  updateFileModTime,
} = require("../../../utils/isFileModified");

async function phil_mri_rmmu_short(jobId, sysConfigData, fileToParse) {
  const dateTimeVersion = fileToParse.datetimeVersion;
  const sme = sysConfigData.id;

  const data = [];

  try {
    await log("info", "NA", sme, "phil_mri_rmmu_short", "FN CALL");

    const complete_file_path = await constructFilePath(
      sysConfigData.hhm_config.file_path,
      fileToParse,
      fileToParse.regEx
    );

    const isUpdatedFile = await isFileModified(
      jobId,
      sme,
      complete_file_path,
      fileToParse
    );

    // dont continue if file is not updated
    if (!isUpdatedFile) return;

    const fileData = (await fs.readFile(complete_file_path)).toString();

    let matches = fileData.matchAll(philips_re.mri.rmmu_short_re);
    let metaData = fileData.match(philips_re.mri.rmmu_meta_data);

    for await (let match of matches) {
      convertDates(match.groups, dateTimeVersion);
      match.groups.system_reference_number =
        metaData.groups.system_reference_number;
      match.groups.hospital_name = metaData.groups.hospital_name;
      match.groups.serial_number_magnet = metaData.groups.serial_number_magnet;
      match.groups.serial_number_meu = metaData.groups.serial_number_meu;
      const matchData = groupsToArrayObj(sme, match.groups);
      data.push(matchData);
    }

    const mappedData = mapDataToSchema(data, phil_mri_rmmu_short_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      await updateFileModTime(jobId, sme, complete_file_path, fileToParse);
    }
  } catch (error) {
    await log("error", "NA", sme, "phil_mri_rmmu_short", "FN CALL", {
      sme: sme,
      file: filePath,
      error: error.message,
    });
  }
}

module.exports = phil_mri_rmmu_short;
