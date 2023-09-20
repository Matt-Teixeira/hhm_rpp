CREATE TABLE process_config (
	system_id TEXT PRIMARY KEY,
    dir dir_config[],
    data_acqu acquisition_config
);

CREATE TYPE acquisition_config AS (
	ip_address inet,
	protocal TEXT,
	local_path TEXT
)

CREATE TYPE dir_config AS (
	name TEXT,
	files file_config[]
);

CREATE TYPE file_config AS (
	name TEXT,
	parsers reg_ex,
	column_name TEXT
);

CREATE TYPE reg_ex AS (
	expressions TEXT[]
);


INSERT INTO process_config (system_id, dir, data_acqu)
VALUES (
	'SME15800',
	ARRAY[
		('monitoring',
			ARRAY[
				('helium_level.dat', ROW(ARRAY['helium_level_re']), 'helium_level_value')::file_config,
				('helium_pressure.dat', ROW(ARRAY['helium_level_re']), 'helium_psi_value')::file_config
			]
		)::dir_config,
		('logcurrent',
			ARRAY[
				('logcurrent.log', ROW(ARRAY['log_cur_re']), 'helium_level_value')::file_config 
			]
		)::dir_config
	],
	ROW(
		'172.31.3.62', 'ssh', '/home/prod/hhm_data_acquisition/files/SME15803'
	)
)

SELECT * FROM process_config
