const { log } = require("../../../logger");
const initialUpdate = require("../../../processing/phil_mri_monitor_data/initialUpdate");
const updatePhilMriTable = require("../../../processing/phil_mri_monitor_data/update_secondary_table/updatePhilMriTable");
const {
  getSystemDbData,
} = require("../../../util/phil_mri_monitor_helpers");
const { compare_dates } = require("../../../util/dates");

async function insertDisplayData(
  jobId,
  sme,
  modality,
  monitoring_configs,
  data,
  date
) {
  try {
    await log("info", jobId, sme, "insertDisplayData", "FN CALL");

    const has_prev_data = await getSystemDbData(jobId, sme);
    let hours_diff = 0;

    if (has_prev_data.rowCount > 0)
      hours_diff = await compare_dates(has_prev_data.rows[0].host_datetime);

    let successful_agg = false;

    // Check to see if this system has data in db. If not, do an initial data insert.
    if (has_prev_data.rowCount === 0 || hours_diff >= 48) {
      // Create entry for new SME
      for (const prop in data) {
        const file_config = monitoring_configs.find(
          (monitor_object) => monitor_object.file_name.split(".")[0] === prop
        );
        successful_agg = await initialUpdate(
          jobId,
          sme,
          file_config,
          data[prop]
        );
        console.log("successful_agg");
        console.log(successful_agg);
        if (successful_agg === false) break;
      }

    } else {
      // Find most recent date in database and start process on that data for data[prop]
      for (const prop in data) {
        const file_config = monitoring_configs.find(
          (monitor_object) => monitor_object.file_name.split(".")[0] === prop
        );

        successful_agg = await updatePhilMriTable(jobId, sme, file_config, data[prop], date);
        if (successful_agg === false) break;
      }
    }
    return successful_agg;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "insertDisplayData", "FN CALL", {
      sme: sme,
      modality,
      error,
    });
  }
}

module.exports = insertDisplayData;

/* FILES
monitor_cryocompressor_cerr
monitor_cryocompressor_palm
monitor_cryocompressor_talm
monitor_cryocompressor_time_status
monitor_magnet_helium_level_value
monitor_magnet_lt_boiloff
monitor_magnet_pressure_dps
monitor_magnet_quench
monitor_System_HumTechRoom
monitor_System_TempTechRoom
monitor_magnet_pressure_avg

monitor_cryocompressor_cerr
monitor_cryocompressor_palm
monitor_cryocompressor_talm
monitor_cryocompressor_time_status
monitor_magnet_helium_level_value
monitor_magnet_lt_boiloff
monitor_magnet_pressure_dps
monitor_magnet_quench
monitor_System_HumTechRoom
monitor_System_TempTechRoom
monitor_magnet_pressure_avg


[
  {
    column: 'tech_room_humidity_value',
    parsers: [ 'monitor_System_HumTechRoom' ],
    file_name: 'monitor_System_HumTechRoom.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'max'
  },
  {
    column: 'tech_room_temp_value',
    parsers: [ 'monitor_System_TempTechRoom' ],
    file_name: 'monitor_System_TempTechRoom.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'max'
  },
  {
    column: 'cryo_comp_comm_error_state',
    parsers: [ 'monitor_cryocompressor_cerr' ],
    file_name: 'monitor_cryocompressor_cerr.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'bool'
  },
  {
    column: 'cryo_comp_press_alarm_state',
    parsers: [ 'monitor_cryocompressor_palm' ],
    file_name: 'monitor_cryocompressor_palm.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'bool'
  },
  {
    column: 'cryo_comp_temp_alarm_state',
    parsers: [ 'monitor_cryocompressor_talm' ],
    file_name: 'monitor_cryocompressor_talm.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'bool'
  },
  {
    column: 'cryo_comp_malf_value',
    parsers: [ 'monitor_cryocompressor_time_status' ],
    file_name: 'monitor_cryocompressor_time_status.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'max'
  },
  {
    column: 'helium_level_value',
    parsers: [ 'monitor_magnet_helium_level_value' ],
    file_name: 'monitor_magnet_helium_level_value.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'min'
  },
  {
    column: 'long_term_boil_off_value',
    parsers: [ 'monitor_magnet_lt_boiloff' ],
    file_name: 'monitor_magnet_lt_boiloff.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'max'
  },
  {
    column: 'mag_dps_status_value',
    parsers: [ 'monitor_magnet_pressure_dps' ],
    file_name: 'monitor_magnet_pressure_dps.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'max'
  },
  {
    column: 'quenched_state',
    parsers: [ 'monitor_magnet_quench' ],
    file_name: 'monitor_magnet_quench.dat',
    pg_tables: [ 'philips_mri_json', 'philips_mri_monitoring_data' ],
    aggregation: 'bool'
  }
]
*/
