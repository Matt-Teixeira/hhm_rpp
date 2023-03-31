let data = [
  {
    logcurrent: {
      query: "logcurrent",
      file_name: "logcurrent.log",
      pg_table: "philips_mri_logcurrent",
      parsers: ["mri_logcurrent"],
    },
  },
  {
    monitoring: [
      {
        file_name: "monitor_System_HumTechRoom.dat",
        parsers: ["monitor_System_HumTechRoom"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "max",
        column: "tech_room_humidity_value",
      },
      {
        file_name: "monitor_System_TempTechRoom.dat",
        parsers: ["monitor_System_TempTechRoom"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "max",
        column: "tech_room_temp_value",
      },
      {
        file_name: "monitor_cryocompressor_cerr.dat",
        parsers: ["monitor_cryocompressor_cerr"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "bool",
        column: "cryo_comp_comm_error_state",
      },
      {
        file_name: "monitor_cryocompressor_palm.dat",
        parsers: ["monitor_cryocompressor_palm"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "bool",
        column: "cryo_comp_press_alarm_state",
      },
      {
        file_name: "monitor_cryocompressor_talm.dat",
        parsers: ["monitor_cryocompressor_talm"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "bool",
        column: "cryo_comp_temp_alarm_state",
      },
      {
        file_name: "monitor_cryocompressor_time_status.dat",
        parsers: ["monitor_cryocompressor_time_status"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "max",
        column: "cryo_comp_malf_value",
      },
      {
        file_name: "monitor_magnet_helium_level_value.dat",
        parsers: ["monitor_magnet_helium_level_value"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "min",
        column: "helium_level_value",
      },
      {
        file_name: "monitor_magnet_lt_boiloff.dat",
        parsers: ["monitor_magnet_lt_boiloff"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "max",
        column: "long_term_boil_off_value",
      },
      {
        file_name: "monitor_magnet_pressure_dps.dat",
        parsers: ["monitor_magnet_pressure_dps"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "max",
        column: "mag_dps_status_value",
      },
      {
        file_name: "monitor_magnet_quench.dat",
        parsers: ["monitor_magnet_quench"],
        pg_tables: ["philips_mri_json", "philips_mri_monitoring_data"],
        aggregation: "bool",
        column: "quenched_state",
      },
    ],
  },
];

let monitoring_index;

for (let i = 0; i < data.length; i++) {
    let key = Object.keys(data[i])
    console.log(key[0]);
    if(key[0] === 'monitoring') monitoring_index = i
}

console.log(monitoring_index);
