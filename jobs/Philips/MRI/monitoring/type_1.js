const { log } = require("../../../../logger");
const phil_mri_monitor_jsonb = require("../insert_jsonb_data");
const phil_mri_monitor_display = require("../insert_display_data");
const {
  update_jsonb_state,
} = require("../../../../utils/phil_mri_monitor_helpers");

async function type_1(sysConfigData, System_Monitor, directory) {
  try {
    await log(
      "info",
      System_Monitor.jobId,
      System_Monitor.sysConfigData.id,
      "monitor_agg_type_1",
      "FN CALL",
      {
        system: sysConfigData,
      }
    );

    const [json_data, date, redis_cache] = await phil_mri_monitor_jsonb(
      System_Monitor,
      directory
    );

    if (json_data) {

      // Find index of monitoring object within config data
      let monitoring_index;
      for (let i = 0; i < sysConfigData.hhm_file_config.length; i++) {
        let key = Object.keys(sysConfigData.hhm_file_config[i]);
        if (key[0] === "monitoring") monitoring_index = i;
      }

      let successful_agg = await phil_mri_monitor_display(
        System_Monitor.jobId,
        System_Monitor.sysConfigData.id,
        sysConfigData.hhm_config.modality,
        sysConfigData.hhm_file_config[monitoring_index].monitoring,
        json_data,
        date
      );

      if (successful_agg) {
        for await (const file_data of redis_cache) {
          await System_Monitor.get_last_monitor_line(
            file_data.path,
            file_data.file_name
          );
        }
        await update_jsonb_state(
          System_Monitor.jobId,
          System_Monitor.sysConfigData.id,
          [date]
        );
      }
    }
  } catch (error) {
    await log(
      "error",
      System_Monitor.jobId,
      System_Monitor.sysConfigData.id,
      "monitor_agg_type_1",
      "FN CALL",
      {
        error: error,
      }
    );
  }
}

module.exports = type_1;
