("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const insertJsonB = require("../../../persist/phil_mri_monitor_data/bulk_jsonb_insert");
const { getMonitorFiles } = require("../../../utils/regExHelpers");

async function phil_mri_monitor(system, directory) {
  try {
    await log("info", system.jobId, system.sme, "phil_mri_monitor", "FN CALL");

    const jsonData = {};

    for await (const file of directory.monitoring) {
      if (file.file_name === "monitor_magnet_quench.dat") {
        const fileName = file.file_name.split(".")[0];
        jsonData[fileName] = [];

        const complete_file_path = `${system.sysConfigData.hhm_config.file_path}/${file.file_name}`;

        //await system.get_last_monitor_line(complete_file_path, file.file_name)
        const last_line = await system.get_redis_line(file);

        const file_delta = await system.get_monitor_delta(
          complete_file_path,
          last_line
        );

        const matches = file_delta.matchAll(
          philips_re.mri.monitor[file.parsers[0]]
        );

        for (let match of matches) {
          jsonData[fileName].push({...match.groups});
        }
      }
    }

    console.log(jsonData);

    /*
    await insertJsonB(jobId, [sme, jsonData]);

    return jsonData;
    */
  } catch (error) {
    console.log(error);
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
