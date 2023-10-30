INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME10056',
	'10.64.35.206',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME10056',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME10056',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME10056',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02589',
	'10.181.90.51',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02589',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02589',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02589',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00410',
	'165.6.155.204',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00410',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00410',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00410',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07859',
	'10.145.0.213',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07859',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07859',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07859',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02471',
	'172.23.68.10',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02471',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02471',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02471',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07856',
	'10.40.130.45',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07856',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07856',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07856',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07846',
	'10.148.34.62',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07846',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07846',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07846',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07853',
	'10.194.10.158',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07853',
	'13',
	'phil_ct_data_grab_2.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07853',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07853',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07847',
	'10.195.18.203',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07847',
	'13',
	'phil_ct_data_grab_2.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07847',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07847',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07867',
	'172.16.144.244',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07867',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07867',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07867',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01447',
	'172.27.55.222',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01447',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01447',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01447',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01446',
	'172.27.51.246',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01446',
	'13',
	'phil_ct_data_grab_1.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01446',
	'EALInfo.output',
	'eal',
	ARRAY['ct_eal_v_2'], -- regex
	ARRAY['philips_ct_eal'], -- tables
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01446',
	'Events.output',
	'events',
	ARRAY['ct_events_v2'], -- regex
	ARRAY['philips_ct_events'], -- tables
	NULL,
	NULL
);