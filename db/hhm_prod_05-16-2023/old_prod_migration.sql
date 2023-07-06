BEGIN;

create schema log;


CREATE TABLE log.ge_ct_gesys(
    id BIGSERIAL PRIMARY KEY,
    system_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
    host_date TEXT,
    host_time TIME,
    year INT,
    message_number INT,
    misc_param_2 INT,
    type TEXT,
    data_1 TEXT,
    num_1 INT,
    date_2 TEXT,
    host TEXT,
    ermes_number INT,
    exception_class TEXT,
    severity TEXT,
    file TEXT,
    line_number INT,
    scan_type TEXT,
    warning TEXT,
    end_msg TEXT,
    message TEXT,
    sr INT,
    en INT,
    host_datetime TIMESTAMP WITH TIME ZONE
);

CREATE TABLE log.ge_cv_syserror(
    id BIGSERIAL PRIMARY KEY,
    system_id TEXT,
    sequencenumber INT,
    host_date DATE,
    host_time TEXT,
    subsystem VARCHAR(8),
    errorcode INT,
    errortext TEXT,
    exam INT,
    exceptioncategory VARCHAR(10),
    application TEXT,
    majorfunction TEXT,
    minorfunction TEXT,
    fru TEXT,
    viewinglevel INT,
    rootcause INT,
    repeatcount INT,
    debugtext TEXT,
    sourcefile TEXT,
    sourceline INT,
    host_datetime TIMESTAMP WITH TIME ZONE
);

CREATE TABLE log.ge_mri_gesys(
    id BIGSERIAL PRIMARY KEY,
    system_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
    host_date TEXT,
    host_time TIME,
    year INT,
    message_number INT,
    misc_param_2 INT,
    type TEXT,
    data_1 TEXT,
    num_1 INT,
    server TEXT,
    task_id TEXT,
    task_epoc INT,
    object TEXT,
    exception_class TEXT,
    severity TEXT,
    function TEXT,
    psd TEXT,
    coil TEXT,
    scan TEXT,
    message TEXT,
    sr INT,
    en INT,
    host_datetime TIMESTAMP WITH TIME ZONE
);

CREATE TABLE log.philips_cv_eventlog(
    id BIGSERIAL PRIMARY KEY,
    system_id TEXT,
    category TEXT,
    host_date DATE,
    host_time TIME,
    error_type TEXT,
    num_1 INT,
    technical_event_id INT,
    description  TEXT,
    channel_id  TEXT,
    module TEXT,
    source TEXT,
    line INT,
    memo TEXT,
    subsystem_number INT,
    thread_name TEXT,
    message TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE
);


-- >> INDEXES

-- log.ge_mri_gesys;
CREATE INDEX idx_ge_mri_gesys_system_id ON log.ge_mri_gesys(system_id);
CREATE INDEX idx_ge_mri_gesys_datetime ON log.ge_mri_gesys(host_datetime);

-- log.ge_ct_gesys;
CREATE INDEX idx_ge_ct_gesys_system_id ON log.ge_ct_gesys(system_id);
CREATE INDEX idx_ge_ct_gesys_datetime ON log.ge_ct_gesys(host_datetime);

-- log.ge_cv_syserror;
CREATE INDEX idx_ge_cv_syserror_system_id ON log.ge_cv_syserror(system_id);
CREATE INDEX idx_ge_cv_syserror_datetime ON log.ge_cv_syserror(host_datetime);

-- log.philips_cv_eventlog;
CREATE INDEX idx_philips_cv_eventlog_system_id ON log.philips_cv_eventlog(system_id);
CREATE INDEX idx_philips_cv_eventlog_datetime ON log.philips_cv_eventlog(host_datetime);

ROLLBACK;