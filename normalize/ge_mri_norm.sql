INSERT INTO config.process_con'SME01123', 'GE', 'MRI', NULL);

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01123',
	'10.187.24.39',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01123',
	'4',
	'ge_mri_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01123',
	'gesys_PCNMR001.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01096',
	'10.232.26.13',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01096',
	'5',
	'ge_mri_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01096',
	'gesys_PARMR002.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01096',
	'gesys_mroc.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01422',
	'172.22.23.235',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01422',
	'5',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01422',
	'gesys_GRDMR01.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12424',
	'167.171.115.90',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12424',
	'5',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12424',
	'gesys_gemr1.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12489',
	'167.171.115.90',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12489',
	'5',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12489',
	'gesys_DVMR.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12414',
	'167.171.166.176',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12414',
	'6',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12414',
	'gesys_RMR2.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02583',
	'10.50.10.109',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02583',
	'5',
	'ge_mri_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02583',
	'gesys_DVMR.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02524',
	'172.18.41.22',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02524',
	'4',
	'ge_mri_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02524',
	'gesys_mr2-ow0.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12448',
	'10.64.35.207',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12448',
	'5',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12448',
	'gesys_lx-mr.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12416',
	'10.40.130.44',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12416',
	'6',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12416',
	'gesys_GEMRPHP2.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12415',
	'167.171.166.166',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12415',
	'6',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12415',
	'gesys_MR450.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12452',
	'10.184.10.205',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12452',
	'6',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12452',
	'gesys_lx-mrE.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02582',
	'10.50.8.60',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02582',
	'5',
	'ge_mri_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02582',
	'gesys_lx-mr.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);

-- >
-- >


INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME12631',
	'10.73.61.14',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME12631',
	'5',
	'ge_mri_22.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12631',
	'gesys_MNSHGEMRRAD.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);
INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME12631',
	'gesys_PMNMR001.log',
	'gesys',
	ARRAY['block', 'sub_block'],
	ARRAY['ge_mri_gesys'],
	NULL,
	NULL
);