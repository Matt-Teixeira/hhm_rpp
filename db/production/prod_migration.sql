BEGIN;
-- Drop old static tables
DROP TABLE IF EXISTS log.ge_ct_gesys;
DROP TABLE IF EXISTS log.ge_cv_syserror;
DROP TABLE IF EXISTS log.ge_mri_gesys;
DROP TABLE IF EXISTS log.philips_cv_eventlog;

CREATE SCHEMA log;
CREATE SCHEMA mag;
ROLLBACK;

BEGIN;

CREATE TABLE logfile_event_history_metadata (
    system_id TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    name TEXT,
    value TEXT,
    CONSTRAINT pk_logfile_event_history_metadata PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.siemens_mri(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_siemens_mri PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.siemens_ct(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_siemens_ct PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.siemens_cv(
    system_id VARCHAR(10),
    host_date TEXT,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_siemens_cv PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.ge_mri_gesys(
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_ge_mri_gesys PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.ge_ct_gesys(
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_ge_ct_gesys PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.ge_cv_syserror(
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_ge_cv_syserror PRIMARY KEY (system_id, host_datetime)
);


CREATE TABLE log.philips_ct_eal(
    system_id TEXT,
    host_date TEXT,
    host_time TEXT,
    controller TEXT,
    data_type TEXT,
    log_number TEXT,
    tm_stamp TEXT,
    err_type TEXT,
    err_number TEXT,
    vxw_err_no TEXT,
    file TEXT,
    line TEXT,
    param_1 TEXT,
    param_2 TEXT,
    info TEXT,
    eal_time TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_ct_eal PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.philips_ct_events(
    system_id TEXT,
    type TEXT,
    level TEXT,
    module TEXT,
    time_stamp TEXT,
    host_date TEXT,
    host_time TEXT,
    message TEXT,
    eal TEXT,
    event_time TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_ct_events PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_rmmu_history(
    system_id TEXT,
    Line INT,
    Time INT,
    Stat INT,
    AvgPwr INT,
    MinPwr INT,
    MaxPwr INT,
    MinPr INT,
    MaxPr INT,
    LHe1 INT,
    LHe2 INT,
    DPS INT,
    TALM INT,
    PALM INT,
    CRes INT,
    system_reference_number INT,
    hospital_name TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_rmmu_history PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_rmmu_magnet(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_rmmu_magnet PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.philips_mri_logcurrent(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_logcurrent PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_rmmu_short(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_rmmu_short PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_rmmu_long(
    system_id TEXT,
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_rmmu_long PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE log.philips_cv_eventlog(
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
    host_datetime TIMESTAMP WITH TIME ZONE,
    status BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_cv_eventlog PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_json(
    capture_time TIMESTAMP WITH TIME ZONE,
    system_id TEXT,
    monitoring_data jsonb,
    process_success BOOLEAN DEFAULT false,
    CONSTRAINT pk_philips_mri_json PRIMARY KEY (system_id, capture_time)
);

CREATE TABLE mag.philips_mri_monitoring_data(
    system_id TEXT,
    host_datetime TIMESTAMP WITH TIME ZONE,
    date TEXT,
    tech_room_humidity_value DECIMAL, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value DECIMAL, -- [C](0=sensor not connected or broken)
    cryo_comp_comm_error_state DECIMAL, -- 0=OK, > 0 = alarm bool
    cryo_comp_press_alarm_state DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_state DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value DECIMAL, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value DECIMAL, -- [%]
    long_term_boil_off_value DECIMAL, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value DECIMAL, -- (minutes) [0=OK,  >0 =Alarm status]
    quenched_state DECIMAL, -- [0=No;1=Yes
    CONSTRAINT pk_philips_mri_monitoring_data PRIMARY KEY (system_id, host_datetime)
);

CREATE TABLE mag.philips_mri_monitoring_data_agg(
    system_id TEXT,
    date TEXT,
    capture_datetime TIMESTAMP WITH TIME ZONE,
    host_datetime TIMESTAMP WITH TIME ZONE,
    tech_room_humidity_value DECIMAL, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value DECIMAL, -- [C](0=sensor not connected or broken)
    cryo_comp_comm_error_state DECIMAL, -- 0=OK, > 0 = alarm bool
    cryo_comp_press_alarm_state DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_state DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value DECIMAL, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value DECIMAL, -- [%]
    long_term_boil_off_value DECIMAL, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value DECIMAL, -- (minutes) [0=OK,  >0 =Alarm status]
    quenched_state DECIMAL, -- [0=No;1=Yes
    CONSTRAINT pk_philips_mri_monitoring_data_agg PRIMARY KEY (system_id, capture_datetime)
);

ROLLBACK;

BEGIN;

CREATE OR REPLACE FUNCTION upsert_philips_mri_monitoring_data() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO mag.philips_mri_monitoring_data (
    system_id,
    host_datetime,
    date,
    tech_room_humidity_value,
    tech_room_temp_value,
    cryo_comp_comm_error_state,
    cryo_comp_press_alarm_state,
    cryo_comp_temp_alarm_state,
    cryo_comp_malf_value,
    helium_level_value,
    long_term_boil_off_value,
    mag_dps_status_value,
    quenched_state
  )
  VALUES (
    NEW.system_id,
    NEW.host_datetime,
    NEW.date,
    NEW.tech_room_humidity_value,
    NEW.tech_room_temp_value,
    NEW.cryo_comp_comm_error_state,
    NEW.cryo_comp_press_alarm_state,
    NEW.cryo_comp_temp_alarm_state,
    NEW.cryo_comp_malf_value,
    NEW.helium_level_value,
    NEW.long_term_boil_off_value,
    NEW.mag_dps_status_value,
    NEW.quenched_state  
  )
  ON CONFLICT (system_id, host_datetime)
  DO UPDATE SET 
    date                        = COALESCE(excluded.date, philips_mri_monitoring_data.date),
    tech_room_humidity_value    = COALESCE(excluded.tech_room_humidity_value, philips_mri_monitoring_data.tech_room_humidity_value),
    tech_room_temp_value        = COALESCE(excluded.tech_room_temp_value, philips_mri_monitoring_data.tech_room_temp_value),
    cryo_comp_comm_error_state  = COALESCE(excluded.cryo_comp_comm_error_state, philips_mri_monitoring_data.cryo_comp_comm_error_state),
    cryo_comp_press_alarm_state = COALESCE(excluded.cryo_comp_press_alarm_state, philips_mri_monitoring_data.cryo_comp_press_alarm_state),
    cryo_comp_temp_alarm_state  = COALESCE(excluded.cryo_comp_temp_alarm_state, philips_mri_monitoring_data.cryo_comp_temp_alarm_state),
    cryo_comp_malf_value        = COALESCE(excluded.cryo_comp_malf_value, philips_mri_monitoring_data.cryo_comp_malf_value),
    helium_level_value          = COALESCE(excluded.helium_level_value, philips_mri_monitoring_data.helium_level_value),
    long_term_boil_off_value    = COALESCE(excluded.long_term_boil_off_value, philips_mri_monitoring_data.long_term_boil_off_value),
    mag_dps_status_value        = COALESCE(excluded.mag_dps_status_value, philips_mri_monitoring_data.mag_dps_status_value),
    quenched_state              = COALESCE(excluded.quenched_state, philips_mri_monitoring_data.quenched_state);
                
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER philips_mri_monitoring_data_upsert_trigger
AFTER INSERT ON mag.philips_mri_monitoring_data_agg
FOR EACH ROW
EXECUTE FUNCTION upsert_philips_mri_monitoring_data();

CREATE TRIGGER philips_mri_monitoring_data_upsert_update_trigger
AFTER UPDATE ON mag.philips_mri_monitoring_data_agg
FOR EACH ROW
EXECUTE FUNCTION upsert_philips_mri_monitoring_data();

ROLLBACK;

-- SYSTEM UNITS

BEGIN;

CREATE TABLE mag.philips_mri_units(
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
ALTER TABLE ONLY mag.philips_mri_units
    ADD CONSTRAINT fk_system_id FOREIGN KEY (system_id) REFERENCES public.systems(id);

INSERT INTO mag.philips_mri_units (system_id, tech_room_humidity_value, tech_room_temp_value, cryo_comp_press_alarm_value, cryo_comp_temp_alarm_value, cryo_comp_malf_value, helium_level_value, long_term_boil_off_value, mag_dps_status_value)
VALUES ('SME01138', '%', 'C', 'minutes', 'minutes', 'minutes', '%', 'ml/h', 'minutes');

ROLLBACK;

-- >> INDEXES
BEGIN;

-- log.siemens_mri
CREATE INDEX idx_siemens_mri_id_datetime ON log.siemens_mri(system_id, host_datetime);
CREATE INDEX idx_siemens_mri_system_id ON log.siemens_mri(system_id);
CREATE INDEX idx_siemens_mri_datetime ON log.siemens_mri(host_datetime);

-- log.siemens_ct;
CREATE INDEX idx_siemens_ct_id_datetime ON log.siemens_ct(system_id, host_datetime);
CREATE INDEX idx_siemens_ct_system_id ON log.siemens_ct(system_id);
CREATE INDEX idx_siemens_ct_datetime ON log.siemens_ct(host_datetime);

-- log.siemens_cv;
CREATE INDEX idx_siemens_cv_id_datetime ON log.siemens_cv(system_id, host_datetime);
CREATE INDEX idx_siemens_cv_system_id ON log.siemens_cv(system_id);
CREATE INDEX idx_siemens_cv_datetime ON log.siemens_cv(host_datetime);

-- log.ge_mri_gesys;
CREATE INDEX idx_ge_mri_gesys_id_datetime ON log.ge_mri_gesys(system_id, host_datetime);
CREATE INDEX idx_ge_mri_gesys_system_id ON log.ge_mri_gesys(system_id);
CREATE INDEX idx_ge_mri_gesys_datetime ON log.ge_mri_gesys(host_datetime);

-- log.ge_ct_gesys;
CREATE INDEX idx_ge_ct_gesys_id_datetime ON log.ge_ct_gesys(system_id, host_datetime);
CREATE INDEX idx_ge_ct_gesys_system_id ON log.ge_ct_gesys(system_id);
CREATE INDEX idx_ge_ct_gesys_datetime ON log.ge_ct_gesys(host_datetime);

-- log.ge_cv_syserror;
CREATE INDEX idx_ge_cv_syserror_id_datetime ON log.ge_cv_syserror(system_id, host_datetime);
CREATE INDEX idx_ge_cv_syserror_system_id ON log.ge_cv_syserror(system_id);
CREATE INDEX idx_ge_cv_syserror_datetime ON log.ge_cv_syserror(host_datetime);

-- log.philips_ct_eal;
CREATE INDEX idx_philips_ct_eal_id_datetime ON log.philips_ct_eal(system_id, host_datetime);
CREATE INDEX idx_philips_ct_eal_system_id ON log.philips_ct_eal(system_id);
CREATE INDEX idx_philips_ct_eal_datetime ON log.philips_ct_eal(host_datetime);

-- log.philips_ct_events;
CREATE INDEX idx_philips_ct_events_id_datetime ON log.philips_ct_events(system_id, host_datetime);
CREATE INDEX idx_philips_ct_events_system_id ON log.philips_ct_events(system_id);
CREATE INDEX idx_philips_ct_events_datetime ON log.philips_ct_events(host_datetime);

-- mag.philips_mri_rmmu_magnet;
CREATE INDEX idx_philips_mri_rmmu_magnet_id_datetime ON mag.philips_mri_rmmu_magnet(system_id, host_datetime);
CREATE INDEX idx_philips_mri_rmmu_magnet_system_id ON mag.philips_mri_rmmu_magnet(system_id);
CREATE INDEX idx_philips_mri_rmmu_magnet_datetime ON mag.philips_mri_rmmu_magnet(host_datetime);

-- log.philips_mri_logcurrent;
CREATE INDEX idx_philips_mri_logcurrent_id_datetime ON log.philips_mri_logcurrent(system_id, host_datetime);
CREATE INDEX idx_philips_mri_logcurrent_system_id ON log.philips_mri_logcurrent(system_id);
CREATE INDEX idx_philips_mri_logcurrent_datetime ON log.philips_mri_logcurrent(host_datetime);

-- mag.philips_mri_rmmu_short;
CREATE INDEX idx_philips_mri_rmmu_short_id_datetime ON mag.philips_mri_rmmu_short(system_id, host_datetime);
CREATE INDEX idx_philips_mri_rmmu_short_system_id ON mag.philips_mri_rmmu_short(system_id);
CREATE INDEX idx_philips_mri_rmmu_short_datetime ON mag.philips_mri_rmmu_short(host_datetime);

-- mag.philips_mri_rmmu_long;
CREATE INDEX idx_philips_mri_rmmu_long_id_datetime ON mag.philips_mri_rmmu_long(system_id, host_datetime);
CREATE INDEX idx_philips_mri_rmmu_long_system_id ON mag.philips_mri_rmmu_long(system_id);
CREATE INDEX idx_philips_mri_rmmu_long_datetime ON mag.philips_mri_rmmu_long(host_datetime);

-- log.philips_cv_eventlog;
CREATE INDEX idx_philips_cv_eventlog_id_datetime ON log.philips_cv_eventlog(system_id, host_datetime);
CREATE INDEX idx_philips_cv_eventlog_system_id ON log.philips_cv_eventlog(system_id);
CREATE INDEX idx_philips_cv_eventlog_datetime ON log.philips_cv_eventlog(host_datetime);

-- mag.philips_mri_monitor;
CREATE INDEX idx_philips_mri_json_system_id ON mag.philips_mri_json(system_id, capture_time);

-- mag.philips_mri_monitoring_data;
CREATE INDEX idx_philips_mri_monitoring_data_id_datetime ON mag.philips_mri_monitoring_data(system_id, host_datetime);
CREATE INDEX idx_philips_mri_monitoring_data_system_id ON mag.philips_mri_monitoring_data(system_id);
CREATE INDEX idx_philips_mri_monitoring_data_datetime ON mag.philips_mri_monitoring_data(host_datetime);

ROLLBACK;