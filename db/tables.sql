BEGIN;

ALTER TABLE systems
DROP COLUMN hhm_config;

ALTER TABLE systems
DROP COLUMN hhm_file_config;

ALTER TABLE systems
ADD COLUMN hhm_config jsonb;

ALTER TABLE systems
ADD COLUMN hhm_file_config jsonb;

create schema log;

DROP TABLE IF EXISTS log.siemens_mri;
DROP TABLE IF EXISTS log.siemens_ct;
DROP TABLE IF EXISTS log.siemens_cv;
DROP TABLE IF EXISTS log.ge_mri_gesys;
DROP TABLE IF EXISTS log.ge_ct_gesys;
DROP TABLE IF EXISTS log.ge_cv_syserror;
DROP TABLE IF EXISTS log.philips_ct_eal;
DROP TABLE IF EXISTS log.philips_ct_events;
DROP TABLE IF EXISTS log.philips_mri_rmmu_magnet;
DROP TABLE IF EXISTS log.philips_mri_logcurrent;
DROP TABLE IF EXISTS log.philips_mri_rmmu_short;
DROP TABLE IF EXISTS log.philips_mri_rmmu_long;
DROP TABLE IF EXISTS log.philips_cv_eventlog;
DROP TABLE IF EXISTS log.philips_mri_monitor;
DROP TABLE IF EXISTS log.philips_mri_monitoring_data;

CREATE TABLE log.siemens_mri(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state TEXT,
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.siemens_ct(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state TEXT,
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.siemens_cv(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.ge_mri_gesys(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
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
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.ge_ct_gesys(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
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
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.ge_cv_syserror(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
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
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);


CREATE TABLE log.philips_ct_eal(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    line TEXT,
    err_type TEXT,
    tmstamp TEXT,
    file TEXT,
    datatype TEXT,
    param1 TEXT,
    errnum TEXT,
    info TEXT,
    dtime TEXT,
    ealtime TEXT,
    lognumber TEXT,
    param2 TEXT,
    vxwerrno INT,
    controller TEXT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_ct_events(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    eventtime TEXT,
    blob TEXT,
    type TEXT,
    tstampnum TEXT,
    eal TEXT,
    level TEXT,
    ermodulernum TEXT,
    dtime TEXT,
    msg TEXT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_mri_rmmu_magnet(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    system_reference_number TEXT,
    hospital_name TEXT,
    serial_number_magnet TEXT,
    serial_number_meu TEXT,
    lineno INT,
    year INT,
    mo INT,
    dy INT,
    hr INT,
    mn INT,
    ss INT,
    hs INT,
    event TEXT,
    data TEXT,
    descr TEXT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_mri_logcurrent(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_date DATE,
    host_time TIME,
    row_type TEXT,
    event_type TEXT,
    subsystem TEXT,
    code_1 TEXT,
    code_2 TEXT,
    group_1 TEXT,
    message TEXT,
    packets_created TEXT,
    data_created_value TEXT,
    size_copy_value TEXT,
    data_8 TEXT,
    reconstructor TEXT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_mri_rmmu_short(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    system_reference_number TEXT,
    hospital_name TEXT,
    serial_number_magnet TEXT,
    serial_number_meu TEXT,
    lineno INT,
    year INT,
    mo INT,
    dy INT,
    hr INT,
    mn INT,
    ss INT,
    hs INT,
    AvgPwr_value INT,
    MinPwr_value INT,
    MaxPwr_value INT,
    AvgAbs_value INT,
    AvgPrMbars_value INT,
    MinPrMbars_value INT,
    MaxPrMbars_value INT,
    LHePct_value INT,
    LHe2_value INT,
    DiffPressureSwitch_state varchar(2),
    TempAlarm_state varchar(2),
    PressureAlarm_state varchar(2),
    Cerr_state varchar(2),
    CompressorReset_state varchar(2),
    Chd_value INT,
    Cpr_value INT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_mri_rmmu_long(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    system_reference_number TEXT,
    hospital_name TEXT,
    serial_number_magnet TEXT,
    serial_number_meu TEXT,
    lineno INT,
    year INT,
    mo INT,
    dy INT,
    hr INT,
    mn INT,
    ss INT,
    hs INT,
    dow_value INT,
    AvgPwr_value INT,
    MinPwr_value INT,
    MaxPwr_value INT,
    AvgAbs_value INT,
    AvgPrMbars_value INT,
    MinPrMbars_value INT,
    MaxPrMbars_value INT,
    LHePct_value INT,
    LHe2_value INT,
    DiffPressureSwitch_state varchar(2),
    TempAlarm_state varchar(2),
    PressureAlarm_state varchar(2),
    Cerr_state varchar(2),
    CompressorReset_state varchar(2),
    Chd_value INT,
    Cpr_value INT,
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_cv_eventlog(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
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
    host_datetime TIMESTAMP,
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

CREATE TABLE log.philips_mri_monitor(
    capture_time TIMESTAMP PRIMARY KEY,
    equipment_id TEXT,
    monitoring_data jsonb
);

CREATE TABLE log.philips_mri_monitoring_data(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_datetime TIMESTAMP,
    date TEXT,
    tech_room_humidity_value DECIMAL, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value DECIMAL, -- [C](0=sensor not connected or broken)
    cryo_comp_comm_error_state DECIMAL, -- 0=OK, > 0 = alarm bool
    cryo_comp_press_alarm_value DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_value DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value DECIMAL, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value DECIMAL, -- [%]
    long_term_boil_off_value DECIMAL, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value DECIMAL, -- (minutes) [0=OK,  >0 =Alarm status]
    quenched_state DECIMAL, -- [0=No;1=Yes]
    status TEXT DEFAULT 'AWAITING PROCESSING'
);

-- System Unites

DROP TABLE IF EXISTS log.philips_mri_units;

CREATE TABLE log.philips_mri_units(
    system_id text NOT NULL PRIMARY KEY,
    dow_value TEXT,
    AvgPwr_value TEXT,
    MinPwr_value TEXT,
    MaxPwr_value TEXT,
    AvgAbs_value TEXT,
    AvgPrMbars_value TEXT,
    MinPrMbars_value TEXT,
    MaxPrMbars_value TEXT,
    LHePct_value TEXT,
    LHe2_value TEXT,
    Chd_value TEXT,
    Cpr_value TEXT,
    tech_room_humidity_value TEXT, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value TEXT, -- [C](0=sensor not connected or broken)
    cryo_comp_press_alarm_value TEXT, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_value TEXT, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value TEXT, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value TEXT, -- [%]
    long_term_boil_off_value TEXT, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value TEXT -- (ml/h) [0=OK,  >0 =Alarm status]
);
ALTER TABLE ONLY log.philips_mri_units
    ADD CONSTRAINT fk_system_id FOREIGN KEY (system_id) REFERENCES public.systems(id);

INSERT INTO log.philips_mri_units (system_id, tech_room_humidity_value, tech_room_temp_value, cryo_comp_press_alarm_value, cryo_comp_temp_alarm_value, cryo_comp_malf_value, helium_level_value, long_term_boil_off_value, mag_dps_status_value)
VALUES ('SME01138', '%', 'C', 'minutes', 'minutes', 'minutes', '%', 'ml/h', 'minutes');

-- >> INDEXES

-- log.siemens_mri
CREATE INDEX idx_siemens_mri_equipment_id ON log.siemens_mri(equipment_id);
CREATE INDEX idx_siemens_mri_datetime ON log.siemens_mri(host_datetime);

-- log.siemens_ct;
CREATE INDEX idx_siemens_ct_equipment_id ON log.siemens_ct(equipment_id);
CREATE INDEX idx_siemens_ct_datetime ON log.siemens_ct(host_datetime);

-- log.siemens_cv;
CREATE INDEX idx_siemens_cv_equipment_id ON log.siemens_cv(equipment_id);
CREATE INDEX idx_siemens_cv_datetime ON log.siemens_cv(host_datetime);

-- log.ge_mri_gesys;
CREATE INDEX idx_ge_mri_gesys_equipment_id ON log.ge_mri_gesys(equipment_id);
CREATE INDEX idx_ge_mri_gesys_datetime ON log.ge_mri_gesys(host_datetime);

-- log.ge_ct_gesys;
CREATE INDEX idx_ge_ct_gesys_equipment_id ON log.ge_ct_gesys(equipment_id);
CREATE INDEX idx_ge_ct_gesys_datetime ON log.ge_ct_gesys(host_datetime);

-- log.ge_cv_syserror;
CREATE INDEX idx_ge_cv_syserror_equipment_id ON log.ge_cv_syserror(equipment_id);
CREATE INDEX idx_ge_cv_syserror_datetime ON log.ge_cv_syserror(host_datetime);

-- log.philips_ct_eal;
CREATE INDEX idx_philips_ct_eal_equipment_id ON log.philips_ct_eal(equipment_id);
CREATE INDEX idx_philips_ct_eal_datetime ON log.philips_ct_eal(host_datetime);

-- log.philips_ct_events;
CREATE INDEX idx_philips_ct_events_equipment_id ON log.philips_ct_events(equipment_id);
CREATE INDEX idx_philips_ct_events_datetime ON log.philips_ct_events(host_datetime);

-- log.philips_mri_rmmu_magnet;
CREATE INDEX idx_philips_mri_rmmu_magnet_equipment_id ON log.philips_mri_rmmu_magnet(equipment_id);
CREATE INDEX idx_philips_mri_rmmu_magnet_datetime ON log.philips_mri_rmmu_magnet(host_datetime);

-- log.philips_mri_logcurrent;
CREATE INDEX idx_philips_mri_logcurrent_equipment_id ON log.philips_mri_logcurrent(equipment_id);
CREATE INDEX idx_philips_mri_logcurrent_datetime ON log.philips_mri_logcurrent(host_datetime);

-- log.philips_mri_rmmu_short;
CREATE INDEX idx_philips_mri_rmmu_short_equipment_id ON log.philips_mri_rmmu_short(equipment_id);
CREATE INDEX idx_philips_mri_rmmu_short_datetime ON log.philips_mri_rmmu_short(host_datetime);

-- log.philips_mri_rmmu_long;
CREATE INDEX idx_philips_mri_rmmu_long_equipment_id ON log.philips_mri_rmmu_long(equipment_id);
CREATE INDEX idx_philips_mri_rmmu_long_datetime ON log.philips_mri_rmmu_long(host_datetime);

-- log.philips_cv_eventlog;
CREATE INDEX idx_philips_cv_eventlog_equipment_id ON log.philips_cv_eventlog(equipment_id);
CREATE INDEX idx_philips_cv_eventlog_datetime ON log.philips_cv_eventlog(host_datetime);

-- log.philips_mri_monitor;
CREATE INDEX idx_philips_mri_monitor_equipment_id ON log.philips_mri_monitor(equipment_id);

-- log.philips_mri_monitoring_data;
CREATE INDEX idx_philips_mri_monitoring_data_equipment_id ON log.philips_mri_monitoring_data(equipment_id);
CREATE INDEX idx_philips_mri_monitoring_data_datetime ON log.philips_mri_monitoring_data(host_datetime);

ROLLBACK;