CREATE TABLE process_config (
    system_id text PRIMARY KEY,
    data_parsing parse_config
);

CREATE TYPE parse_config AS (
	dir_configs dir_config[]
)

CREATE TYPE dir_config AS (
	name TEXT,
	file_configs file_config[]
)

CREATE TYPE file_config AS (
	name TEXT,
	parsers re_config,
	pg_table TEXT[],
	agg TEXT,
	column_name TEXT
)

CREATE TYPE re_config AS (
  	regex_ids TEXT[]
);