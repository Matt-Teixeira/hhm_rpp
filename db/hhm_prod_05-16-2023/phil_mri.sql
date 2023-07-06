UPDATE systems -- OLD PATH
SET hhm_config = '{"file_path": "/opt/hhm-files/C0137/SHIP013/SME01138", "modality": "MRI", "run_group": 1, "data_acqu": "debian"}',
hhm_file_config = '[
{"rmmu_magnet": {"query": "rmmu_magnet", "dir_name": "rmmu_magnet", "pg_table": "philips_mri_rmmu_magnet", "parsers": ["rmmu_magnet_re", "rmmu_meta_data"]}},
{"rmmu_short": {"query": "rmmu_short", "dir_name": "rmmu_short", "pg_table": "philips_mri_rmmu_short", "parsers": ["rmmu_short_re", "rmmu_meta_data"]}}, 
{"rmmu_long": {"query": "rmmu_long", "dir_name": "rmmu_long", "pg_table": "philips_mri_rmmu_long", "parsers": ["rmmu_long_re", "rmmu_meta_data"]}}, 
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "monitor_System_HumTechRoom.dat", "parsers": ["monitor_System_HumTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_humidity_value"},
    {"file_name": "monitor_System_TempTechRoom.dat", "parsers": ["monitor_System_TempTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_temp_value"},
    {"file_name": "monitor_cryocompressor_cerr.dat", "parsers": ["monitor_cryocompressor_cerr"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_comm_error_state"},
    {"file_name": "monitor_cryocompressor_palm.dat", "parsers": ["monitor_cryocompressor_palm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_press_alarm_state"},
    {"file_name": "monitor_cryocompressor_talm.dat", "parsers": ["monitor_cryocompressor_talm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_temp_alarm_state"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_helium_level_value.dat", "parsers": ["monitor_magnet_helium_level_value"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"},
    {"file_name": "monitor_magnet_lt_boiloff.dat", "parsers": ["monitor_magnet_lt_boiloff"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "long_term_boil_off_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME01138';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME01139/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "debian"}',
hhm_file_config = '[
{"rmmu_magnet": {"query": "rmmu_magnet", "dir_name": "rmmu_magnet", "pg_table": "philips_mri_rmmu_magnet", "parsers": ["rmmu_magnet_re", "rmmu_meta_data"]}},
{"rmmu_short": {"query": "rmmu_short", "dir_name": "rmmu_short", "pg_table": "philips_mri_rmmu_short", "parsers": ["rmmu_short_re", "rmmu_meta_data"]}}, 
{"rmmu_long": {"query": "rmmu_long", "dir_name": "rmmu_long", "pg_table": "philips_mri_rmmu_long", "parsers": ["rmmu_long_re", "rmmu_meta_data"]}}, 
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "monitor_cryocompressor_cerr.dat", "parsers": ["monitor_cryocompressor_cerr"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_comm_error_state"},
    {"file_name": "monitor_cryocompressor_palm.dat", "parsers": ["monitor_cryocompressor_palm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_press_alarm_state"},
    {"file_name": "monitor_cryocompressor_talm.dat", "parsers": ["monitor_cryocompressor_talm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_temp_alarm_state"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_helium_level_value.dat", "parsers": ["monitor_magnet_helium_level_value"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"},
    {"file_name": "monitor_magnet_lt_boiloff.dat", "parsers": ["monitor_magnet_lt_boiloff"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "long_term_boil_off_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME01139';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME15805/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "mmb"}',
hhm_file_config = '[
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "monitor_cryocompressor_cerr.dat", "parsers": ["monitor_cryocompressor_cerr"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_comm_error_state"},
    {"file_name": "monitor_cryocompressor_palm.dat", "parsers": ["monitor_cryocompressor_palm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_press_alarm_state"},
    {"file_name": "monitor_cryocompressor_talm.dat", "parsers": ["monitor_cryocompressor_talm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_temp_alarm_state"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_helium_level_value.dat", "parsers": ["monitor_magnet_helium_level_value"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"},
    {"file_name": "monitor_magnet_lt_boiloff.dat", "parsers": ["monitor_magnet_lt_boiloff"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "long_term_boil_off_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME15805';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME15809/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "mmb"}',
hhm_file_config = '[
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "monitor_System_HumTechRoom.dat", "parsers": ["monitor_System_HumTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_humidity_value"},
    {"file_name": "monitor_System_TempTechRoom.dat", "parsers": ["monitor_System_TempTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_temp_value"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME15809';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME15811/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "mmb"}',
hhm_file_config = '[
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "monitor_System_HumTechRoom.dat", "parsers": ["monitor_System_HumTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_humidity_value"},
    {"file_name": "monitor_System_TempTechRoom.dat", "parsers": ["monitor_System_TempTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_temp_value"},
    {"file_name": "monitor_cryocompressor_cerr.dat", "parsers": ["monitor_cryocompressor_cerr"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_comm_error_state"},
    {"file_name": "monitor_cryocompressor_palm.dat", "parsers": ["monitor_cryocompressor_palm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_press_alarm_state"},
    {"file_name": "monitor_cryocompressor_talm.dat", "parsers": ["monitor_cryocompressor_talm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_temp_alarm_state"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_helium_level_value.dat", "parsers": ["monitor_magnet_helium_level_value"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"},
    {"file_name": "monitor_magnet_lt_boiloff.dat", "parsers": ["monitor_magnet_lt_boiloff"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "long_term_boil_off_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME15811';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME15816/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "mmb"}',
hhm_file_config = '[
{"logcurrent": {"query": "logcurrent", "file_name": "logcurrent.log", "pg_table": "philips_mri_logcurrent", "parsers": ["mri_logcurrent"]}},
{"monitoring": [
    {"file_name": "HELIUM_LEVEL.DAT", "parsers": ["HELIUM_LEVEL"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"}
    ]}
]'
WHERE id = 'SME15816';

UPDATE systems
SET hhm_config = '{"file_path": "/opt/files/SME15802/hhm", "modality": "MRI", "run_group": 1, "data_acqu": "mmb"}',
hhm_file_config = '[
{"rmmu": {"query": "rmmu", "dir_name": "rmmu", "pg_table": "philips_mri_rmmu_history", "parsers": ["rmmu", "rmmu_meta_data_history", "rmmu_file_date"]}},
{"monitoring": [
    {"file_name": "monitor_System_HumTechRoom.dat", "parsers": ["monitor_System_HumTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_humidity_value"},
    {"file_name": "monitor_System_TempTechRoom.dat", "parsers": ["monitor_System_TempTechRoom"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "tech_room_temp_value"},
    {"file_name": "monitor_cryocompressor_cerr.dat", "parsers": ["monitor_cryocompressor_cerr"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_comm_error_state"},
    {"file_name": "monitor_cryocompressor_palm.dat", "parsers": ["monitor_cryocompressor_palm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_press_alarm_state"},
    {"file_name": "monitor_cryocompressor_talm.dat", "parsers": ["monitor_cryocompressor_talm"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "cryo_comp_temp_alarm_state"},
    {"file_name": "monitor_cryocompressor_time_status.dat", "parsers": ["monitor_cryocompressor_time_status"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "cryo_comp_malf_value"},
    {"file_name": "monitor_magnet_helium_level_value.dat", "parsers": ["monitor_magnet_helium_level_value"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "min", "column": "helium_level_value"},
    {"file_name": "monitor_magnet_lt_boiloff.dat", "parsers": ["monitor_magnet_lt_boiloff"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "long_term_boil_off_value"},
    {"file_name": "monitor_magnet_pressure_dps.dat", "parsers": ["monitor_magnet_pressure_dps"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "max", "column": "mag_dps_status_value"},
    {"file_name": "monitor_magnet_quench.dat", "parsers": ["monitor_magnet_quench"], "pg_tables": ["philips_mri_json", "philips_mri_monitoring_data"], "aggregation": "bool", "column": "quenched_state"}
    ]}
]'
WHERE id = 'SME15802';