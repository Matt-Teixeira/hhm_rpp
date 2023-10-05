CREATE TABLE IF NOT EXISTS log.siemens_cv(
	id BIGSERIAL PRIMARY KEY,
	system_id VARCHAR(10),
	source TEXT,
	domain TEXT,
	type TEXT,
	id_group TEXT,
	dow TEXT,
	month TEXT,
	day INT,
	year INT,
	time TIME,
	host_datetime TIMESTAMP WITH TIME ZONE,
	status BOOLEAN DEFAULT FALSE,
	capture_datetime TIMESTAMP WITH TIME ZONE
);