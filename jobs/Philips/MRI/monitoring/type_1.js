const phil_mri_monitor_jsonb = require("../insert_jsonb_data");
const phil_mri_monitor_display = require("../insert_display_data");

async function type_1(sysConfigData, System_Monitor, directory) {
  const [json_data, date] = await phil_mri_monitor_jsonb(System_Monitor, directory);

  if (json_data) {

    // Find index of monitoring object within config data
    let monitoring_index;
    for (let i = 0; i < sysConfigData.hhm_file_config.length; i++) {
      let key = Object.keys(sysConfigData.hhm_file_config[i]);
      if (key[0] === "monitoring") monitoring_index = i;
    }

    await phil_mri_monitor_display(
      System_Monitor.jobId,
      System_Monitor.sysConfigData.id,
      sysConfigData.hhm_config.modality,
      sysConfigData.hhm_file_config[monitoring_index].monitoring,
      json_data,
      date
    );
  }
}

module.exports = type_1;
