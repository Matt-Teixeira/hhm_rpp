-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00445',
	'172.16.30.48',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00445',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00445',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00446',
	'172.16.30.137',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00446',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00446',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00782',
	'10.50.49.82',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00782',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00782',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00786',
	'10.50.10.81',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00786',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00786',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01227',
	'10.50.48.21',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01227',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01227',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02548',
	'10.50.48.110',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02548',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02548',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02535',
	'10.200.128.193',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02535',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02535',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02552',
	'172.16.112.240',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02552',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02552',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07852',
	'10.20.152.42',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07852',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07852',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07855',
	'172.16.144.69',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07855',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07855',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07860',
	'172.16.144.93',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07860',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07860',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07862',
	'172.16.104.129',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07862',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07862',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11259',
	'10.75.163.238',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11259',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11259',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11532',
	'10.75.163.135',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11532',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11532',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11925',
	'10.75.163.82',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11925',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11925',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11927',
	'10.75.22.235',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11927',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11927',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00886',
	'10.233.120.22',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00886',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00886',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00888',
	'10.233.120.24',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00888',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00888',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00892',
	'10.232.33.30',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00892',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00892',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11722',
	'192.168.101.141',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11722',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11722',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00508',
	'192.168.50.21',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00508',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00508',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00509',
	'192.168.50.22',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00509',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00509',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00510',
	'192.168.50.25',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00510',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00510',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00511',
	'192.168.50.82',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00511',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00511',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01387',
	'172.22.21.220',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01387',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01387',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01388',
	'172.22.21.221',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01388',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01388',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01389',
	'172.22.21.242',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01389',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01389',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01391',
	'172.18.21.237',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01391',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01391',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01392',
	'172.18.21.225',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01392',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01392',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01393',
	'172.18.21.233',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01393',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01393',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01394',
	'172.18.21.229',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01394',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01394',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01396',
	'172.19.13.239',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01396',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01396',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME01397',
	'172.22.21.231',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME01397',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME01397',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME02531',
	'10.200.128.195',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME02531',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME02531',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME08325',
	'10.111.10.41',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME08325',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME08325',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME00444',
	'172.16.30.49',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME00444',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME00444',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME07761',
	'172.16.116.17',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME07761',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME07761',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME11530',
	'10.75.163.100',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME11530',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME11530',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME17160',
	'129.109.252.30',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME17160',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME17160',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME13488',
	'10.75.163.199',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME13488',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME13488',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME13529',
	'10.75.22.249',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME13529',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME13529',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);

-- >
-- >

INSERT INTO config.acquisition(system_id, host_ip, mmb_ip, protocal, debian_server_path, credentials_group, acquisition_script, run_group, host, user_id, acqu_point)
VALUES (
	'SME13641',
	'10.200.48.61',
	NULL,
	'lftp',
	'/home/matt-teixeira/hep3/hhm_data_acquisition/files/SME13641',
	'12',
	'phil_cv_21.sh',
	1,
	NULL,
	NULL,
	NULL
);

INSERT INTO config.log (system_id, file_name, dir_name, regex_models, pg_tables, column_name, agg)
VALUES(
	'SME13641',
	'EventLog.txe',
	'EventLog',
	ARRAY['eventlog'], -- regex
	ARRAY['philips_cv_eventlog'], -- tables
	NULL,
	NULL
);
