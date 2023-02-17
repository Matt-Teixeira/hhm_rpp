("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const insertJsonB = require("../../../persist/phil_mri_monitor_data/bulk_jsonb_insert");
const { getMonitorFiles } = require("../../../utils/regExHelpers");

async function phil_mri_monitor(System, directory) {
  try {
    await log("info", System.jobId, System.sme, "phil_mri_monitor", "FN CALL");

    const jsonData = {};

    for await (const file of directory.monitoring) {
      //if (file.file_name === "monitor_magnet_quench.dat") {
        const complete_file_path = `${System.sysConfigData.hhm_config.file_path}/${file.file_name}`;

        let file_data;

        const fileName = file.file_name.split(".")[0];

        const last_line = await System.get_redis_line(file);

        // last_line will be null if redis cache non-existant i.e. new system. Pull all data
        if (last_line === null) {
          file_data = await System.get_all_monitor_data(complete_file_path);
        } else {
          file_data = await System.get_monitor_delta(
            complete_file_path,
            last_line
          );

          // consider removing. file_data will be null if no match for last line. Reset redis last line to file's
          // current last line to prevent a negative feedback loop in which no line is ever matched to to stale cache
          if (file_data === null) {
            await System.get_last_monitor_line(
              complete_file_path,
              file.file_name
            );
            continue;
          }
        }

        if (file_data === undefined) {
          await log(
            "warn",
            System.jobId,
            System.sme,
            "phil_mri_monitor",
            "FN CALL",
            { message: "File not present" }
          );
          continue;
        }

        const matches = file_data.matchAll(
          philips_re.mri.monitor[file.parsers[0]]
        );

        jsonData[fileName] = [];
        for (let match of matches) {
          jsonData[fileName].push({ ...match.groups });
        }
        await System.get_last_monitor_line(complete_file_path, file.file_name);
      //}
    }

    if (Object.keys(jsonData).length === 0) {
      await log(
        "warn",
        System.jobId,
        System.sme,
        "phil_mri_monitor",
        "FN CALL", {
          message: "No keys found in json object"
        }
      );
      return;
    }
  
    await insertJsonB(System.jobId, [System.sme, jsonData]);

    return jsonData;
  } catch (error) {
    console.log(error);
    await log(
      "error",
      System.jobId,
      System.sme,
      "phil_mri_monitor",
      "FN CALL",
      {
        error,
      }
    );
  }
}

module.exports = phil_mri_monitor;

/* FILES
monitor_cryocompressor_cerr -
monitor_cryocompressor_palm -
monitor_cryocompressor_talm -
monitor_cryocompressor_time_status -
monitor_magnet_helium_level_value -
monitor_magnet_lt_boiloff -
monitor_magnet_pressure_dps -
monitor_magnet_quench -
monitor_System_HumTechRoom
monitor_System_TempTechRoom
monitor_magnet_pressure_avg


console.log("*********");
        console.log("\nLast Line From Redis: " + file.file_name);
        console.log(last_line + "\n");
        console.log(file_delta);
        console.log(jsonData);
*/
