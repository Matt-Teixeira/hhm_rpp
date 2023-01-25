("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs").promises;
const { philips_re } = require("../../../parse/parsers");
const insertJsonB = require("../../../persist/phil_mri_monitor_data/bulk_jsonb_insert");
const { getMonitorFiles } = require("../../../utils/regExHelpers");

async function phil_mri_monitor(jobId, filePath, sysConfigData) {
  const sme = sysConfigData.id;
  const modality = sysConfigData.hhm_config.modality;

  try {
    await log("info", jobId, sme, "phil_mri_monitor", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
    });

    const jsonData = {};

    let files = await fs.readdir(filePath);

    // Run regex to filter out non-monitor files. Returns array of monitoring files to parse
    const monitorFiles = await getMonitorFiles(files);

    // Seed jsonData with empty arrays named as file names
    for await (const file of monitorFiles) {
      const fileName = file.split(".")[0];
      jsonData[fileName] = [];
    }

    for await (const file of monitorFiles) {
      const fileName = file.split(".")[0];
      const fileData = (await fs.readFile(`${filePath}/${file}`)).toString();
      const matchGroups = fileData.matchAll(philips_re.mri.monitor[fileName]);

      for await (const group of matchGroups) {

        jsonData[fileName].push(group.groups);
      }
    }
    await insertJsonB(jobId, [sme, jsonData]);

    return jsonData;
  } catch (error) {
    await log("error", jobId, sme, "phil_mri_monitor", "FN CALL", {
      sme: sme,
      modality,
      file: filePath,
      error: error,
    });
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
*/
