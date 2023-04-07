("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fsp = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_mri_rmmu_history } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const execLastMod = require("../../../read/exec-file_last_mod");
const {
  seconds_past_midnight,
} = require("../../../processing/date_processing/incoming_date_cleaning");

async function phil_rmmu_history(fileToParse, System) {
  const parsers = fileToParse.parsers;
  const data = [];

  lastModPath = "./read/sh/get_dir_last_mod.sh";
  try {
    await log("info", System.jobId, System.sme, "phil_rmmu_history", "FN CALL");

    // ** Start Data Acquisition **

    // An array for files in rmmu directory (/opt/files/SME15802/hhm/rmmu)
    await System.get_directory_files();

    // Get cached last file in directory from Redis
    await System.get_last_file_parsed();

    // Set last file in rmmu directory
    System.update_files_to_process();

    if (System.files_in_dir.length === 0) {
      const file_mod_datetime = await execLastMod(lastModPath, [
        `${System.sysConfigData.hhm_config.file_path}`,
        "rmmu",
      ]);

      await log("warn", System.jobId, System.sme, "phil_rmmu", "FN CALL", {
        message: "No new files detected",
        path: System.directory_path,
        last_mod: file_mod_datetime,
      });
      return;
    }

    // ** End Data Acquisition **

    // Loops through each file in the dir
    // Change to loop backwards
    for await (const file of System.files_in_dir) {
      const complete_file_path = `${System.directory_path}/${file}`;

      const fileData = (await fsp.readFile(complete_file_path)).toString();

      // ** Begin Parse **

      let matches = fileData.matchAll(philips_re.mri[parsers[0]]);
      let metaData = fileData.match(philips_re.mri[parsers[1]]);

      // Date Formatting
      let file_date = file.match(philips_re.mri[parsers[2]]);

      // Date from file name: 2014-03-25
      const date = `${file_date.groups.year}-${file_date.groups.month}-${file_date.groups.day}`;

      // Loops through each match in 1 file in dir
      for await (const match of matches) {
        match.groups.system_id = System.sme;
        match.groups.system_reference_number =
          metaData.groups.system_reference_number;
        match.groups.hospital_name = metaData.groups.hospital_name;

        // Time associated with each data entry as seconds past midnight (line): 00:07:46
        const time = seconds_past_midnight(match.groups.Time);

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

      const mappedData = mapDataToSchema(data, philips_mri_rmmu_history);
      const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

      // ** End Parse **

      // ** Begin Persist **

      const insertSuccess = await bulkInsert(
        System.jobId,
        dataToArray,
        System.sysConfigData,
        System.fileToParse
      );

      // ** End Persist **

      // Reset data array for next file's data
      data.length = 0;
    }

    // Cache name of last file parsed
    await System.cache_last_file_name(System.last_file_in_dir);

    return;
  } catch (error) {
    await log(
      "error",
      System.jobId,
      System.sme,
      "phil_rmmu_history",
      "FN CALL",
      {
        error,
      }
    );
  }
}

module.exports = phil_rmmu_history;