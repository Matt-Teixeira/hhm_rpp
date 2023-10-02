/* Removed Table
 CREATE TABLE IF NOT EXISTS config.process_config(
 system_id TEXT PRIMARY KEY,
 manufacturer TEXT,
 modality TEXT,
 alt_data_source JSONB
 ); 
 */
CREATE TABLE IF NOT EXISTS config.acquisition(
	system_id TEXT PRIMARY KEY,
	magmon_ip inet,
	mmb_ip inet,
	protocal TEXT,
	debian_server_path TEXT,
	credentials_group TEXT,
	acquisition_script TEXT,
	run_group INT,
	host TEXT,
	user_id TEXT,
	acqu_point TEXT,
	alt_data_source JSONB
);

CREATE TABLE IF NOT EXISTS config.edu(
	system_id TEXT,
	file_name TEXT,
	regex_models TEXT [],
	schedule INT
);

CREATE TABLE IF NOT EXISTS config.mag(
	system_id TEXT,
	file_name TEXT,
	dir_name TEXT,
	regex_models TEXT [],
	pg_tables TEXT [],
	column_name TEXT,
	schedule INT,
	agg TEXT,
	CONSTRAINT fk_system_id FOREIGN KEY (system_id) REFERENCES config.process_config(system_id),
	CONSTRAINT pk_mag_config PRIMARY KEY (system_id, file_name)
);

CREATE TABLE IF NOT EXISTS config.log(
	system_id TEXT,
	file_name TEXT,
	dir_name TEXT,
	regex_models TEXT [],
	pg_tables TEXT [],
	column_name TEXT,
	agg TEXT,
	CONSTRAINT fk_system_id FOREIGN KEY (system_id) REFERENCES config.process_config(system_id),
	CONSTRAINT pk_log_config PRIMARY KEY (system_id, file_name)
);

SELECT
	sys.id,
	sys.manufacturer,
	sys.modality,
	ac.debian_server_path,
	json_build_object(
		'file_name',
		log.file_name,
		'dir_name',
		log.dir_name,
		'parsers',
		log.regex_models,
		'pg_tables',
		log.pg_tables
	) AS log_config
FROM
	systems sys
	JOIN config.acquisition ac ON ac.system_id = sys.id
	JOIN config.log log ON log.system_id = sys.id
WHERE
	sys.manufacturer = 'Philips'
	AND sys.modality = 'MRI'
	AND ac.run_group = 1
GROUP BY
	sys.id,
	ac.system_id,
	log.file_name,
	log.dir_name,
	log.regex_models,
	log.pg_tables;