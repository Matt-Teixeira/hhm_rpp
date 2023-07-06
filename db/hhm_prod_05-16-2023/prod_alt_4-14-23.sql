-- Alter logfile_event_history_metadata to prevent primary key unique issue
BEGIN;
ALTER TABLE logfile_event_history_metadata DROP CONSTRAINT pk_logfile_event_history_metadata;

ALTER TABLE logfile_event_history_metadata
ADD COLUMN id BIGSERIAL;

ALTER TABLE logfile_event_history_metadata ADD PRIMARY KEY (id, system_id);
ROLLBACK;

/* UPDATED TABLE 4-14-2023 
CREATE TABLE IF NOT EXISTS logfile_event_history_metadata (
    id BIGSERIAL,
    system_id TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    name TEXT,
    value TEXT,
    CONSTRAINT pk_logfile_event_history_metadata PRIMARY KEY (id, system_id)
); 
*/