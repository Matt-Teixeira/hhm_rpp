("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fsp = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const {
  philips_mri_rmmu_magnet_schema,
} = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function phil_mri_rmmu_magnet(fileToParse, System) {
  const parsers = fileToParse.parsers;
  const data = [];
  try {
    await log(
      "info",
      System.jobId,
      System.sme,
      "phil_mri_rmmu_magnet",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System.get_directory_files();
    
    if (System.files_in_dir.length === 0) {
      await log(
        "warn",
        System.jobId,
        System.sme,
        "phil_mri_rmmu_magnet",
        "FN CALL",
        {
          message: "Directory is empty",
          directory: System.directory_path,
        }
      );
      return;
    }

    // ** End Data Acquisition

    // Loops through each file in the dir
    for await (const file of System.files_in_dir) {
      const complete_file_path = `${System.directory_path}/${file}`;
      const fileData = (await fsp.readFile(complete_file_path)).toString();

      // ** Begin Parse

      let matches = fileData.matchAll(philips_re.mri[parsers[0]]);
      let metaData = fileData.match(philips_re.mri[parsers[1]]);

      // Loops through each match in 1 file in dir
      for await (const match of matches) {
        match.groups.system_id = System.sme;
        match.groups.system_reference_number =
          metaData.groups.system_reference_number;
        match.groups.hospital_name = metaData.groups.hospital_name;
        match.groups.serial_number_magnet =
          metaData.groups.serial_number_magnet;
        match.groups.serial_number_meu = metaData.groups.serial_number_meu;

        const date = `${match.groups.year}-${match.groups.mo}-${match.groups.dy}`;
        const time = `${match.groups.hr}:${match.groups.mn}:${match.groups.ss}.${match.groups.hs}`;

        const dtObject = await generateDateTime(
          System.jobId,
          match.groups.system_id,
          System.fileToParse.pg_table,
          date,
          time
        );

        if (dtObject === null) {
          await log("warn", System.jobId, System.sme, "date_time", "FN CALL", {
            message: "date_time object null",
            date,
            time,
          });
        }

        match.groups.host_datetime = dtObject;

        data.push(match.groups);
      }

      const mappedData = mapDataToSchema(data, philips_mri_rmmu_magnet_schema);
      const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

      // ** End Parse

      // ** Begin Persist

      const insertSuccess = await bulkInsert(
        System.jobId,
        dataToArray,
        System.sysConfigData,
        System.fileToParse
      );

      // ** End Persist

      // ** Upon successfull db insert, move file to archive dir

      if (insertSuccess) {
        await System.archive_file(complete_file_path);
      }

      data.length = 0;
    }

    return;
  } catch (error) {
    console.log(error);
    await log(
      "error",
      System.jobId,
      System.sme,
      "phil_mri_rmmu_magnet",
      "FN CALL",
      {
        error,
      }
    );
  }
}

module.exports = phil_mri_rmmu_magnet;
