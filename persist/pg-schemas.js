const ge_mri_gesys_schema = {
  system_id: null,
  epoch: null,
  record_number_concurrent: null,
  misc_param_1: null,
  month: null,
  day: null,
  host_date: null,
  host_time: null,
  year: null,
  message_number: null,
  misc_param_2: null,
  type: null,
  data_1: null,
  num_1: null,
  server: null,
  task_id: null,
  task_epoc: null,
  object: null,
  exception_class: null,
  severity: null,
  function: null,
  psd: null,
  coil: null,
  scan: null,
  message: null,
  sr: null,
  en: null,
  host_datetime: null,
  capture_datetime: null
};

const ge_ct_gesys_schema = {
  system_id: null,
  epoch: null,
  record_number_concurrent: null,
  misc_param_1: null,
  month: null,
  day: null,
  host_date: null,
  host_time: null,
  year: null,
  message_number: null,
  misc_param_2: null,
  type: null,
  data_1: null,
  num_1: null,
  date_2: null,
  host: null,
  ermes_number: null,
  exception_class: null,
  severity: null,
  file: null,
  line_number: null,
  scan_type: null,
  warning: null,
  end_msg: null,
  message: null,
  sr: null,
  en: null,
  host_datetime: null,
  capture_datetime: null
};

const ge_cv_syserror_schema = {
  system_id: null,
  sequencenumber: null,
  host_date: null,
  host_time: null,
  subsystem: null,
  errorcode: null,
  errortext: null,
  exam: null,
  exceptioncategory: null,
  application: null,
  majorfunction: null,
  minorfunction: null,
  fru: null,
  viewinglevel: null,
  rootcause: null,
  repeatcount: null,
  debugtext: null,
  sourcefile: null,
  sourceline: null,
  host_datetime: null,
  capture_datetime: null
};

const siemens_ct_mri = {
  system_id: null,
  host_state: null,
  host_date: null,
  host_time: null,
  source_group: null,
  type_group: null,
  text_group: null,
  domain_group: null,
  id_group: null,
  month: null,
  day: null,
  year: null,
  host_datetime: null,
  capture_datetime: null
};

const siemens_cv_schema = {
  system_id: null,
  source: null,
  domain: null,
  type: null,
  id_group: null,
  dow: null,
  month: null,
  day: null,
  year: null,
  time: null,
  text: null,
  capture_datetime: null,
  host_datetime: null
};

const philips_ct_eal_schema = {
  system_id: null,
  host_date: null,
  host_time: null,
  controller: null,
  data_type: null,
  log_number: null,
  tm_stamp: null,
  err_type: null,
  err_number: null,
  vxw_err_no: null,
  file: null,
  line: null,
  param_1: null,
  param_2: null,
  info: null,
  eal_time: null,
  host_datetime: null,
  capture_datetime: null
};

const philips_ct_events_schema = {
  system_id: null,
  type: null,
  level: null,
  module: null,
  time_stamp: null,
  host_date: null,
  host_time: null,
  message: null,
  eal: null,
  event_time: null,
  host_datetime: null,
  capture_datetime: null
};

const phil_mri_logcurrent_schema = {
  system_id: null,
  host_date: null,
  host_time: null,
  row_type: null,
  event_type: null,
  subsystem: null,
  code_1: null,
  code_2: null,
  group_1: null,
  message: null,
  packets_created: null,
  data_created_value: null,
  size_copy_value: null,
  data_8: null,
  reconstructor: null,
  magnet_meu: null,
  host_datetime: null,
  capture_datetime: null
};

const phil_mri_rmmu_short_schema = {
  system_id: null,
  system_reference_number: null,
  hospital_name: null,
  serial_number_magnet: null,
  serial_number_meu: null,
  lineno: null,
  year: null,
  mo: null,
  dy: null,
  hr: null,
  mn: null,
  ss: null,
  hs: null,
  avgpwr_value: null,
  minpwr_value: null,
  maxpwr_value: null,
  avgabs_value: null,
  avgprmbars_value: null,
  minprmbars_value: null,
  maxprmbars_value: null,
  lhepct_value: null,
  lhe2_value: null,
  diffpressureswitch_state: null,
  tempalarm_state: null,
  pressurealarm_state: null,
  cerr_state: null,
  compressorreset_state: null,
  chd_value: null,
  cpr_value: null,
  host_datetime: null
};

const phil_mri_rmmu_long_schema = {
  system_id: null,
  system_reference_number: null,
  hospital_name: null,
  serial_number_magnet: null,
  serial_number_meu: null,
  lineno: null,
  year: null,
  mo: null,
  dy: null,
  hr: null,
  mn: null,
  ss: null,
  hs: null,
  dow_value: null,
  avgpwr_value: null,
  minpwr_value: null,
  maxpwr_value: null,
  avgabs_value: null,
  avgprmbars_value: null,
  minprmbars_value: null,
  maxprmbars_value: null,
  lhepct_value: null,
  lhe2_value: null,
  diffpressureswitch_state: null,
  tempalarm_state: null,
  pressurealarm_state: null,
  cerr_state: null,
  compressorreset_state: null,
  chd_value: null,
  cpr_value: null,
  host_datetime: null
};

const philips_mri_rmmu_magnet_schema = {
  system_id: null,
  system_reference_number: null,
  hospital_name: null,
  serial_number_magnet: null,
  serial_number_meu: null,
  lineno: null,
  year: null,
  mo: null,
  dy: null,
  hr: null,
  mn: null,
  ss: null,
  hs: null,
  event: null,
  data: null,
  descr: null,
  host_datetime: null
};

const philips_mri_rmmu_history = {
  system_id: null,
  line: null,
  time: null,
  stat: null,
  avgpwr: null,
  minpwr: null,
  maxpwr: null,
  minpr: null,
  maxpr: null,
  lhe1: null,
  lhe2: null,
  dps: null,
  talm: null,
  palm: null,
  cres: null,
  system_reference_number: null,
  hospital_name: null,
  host_datetime: null
};

const philips_cv_eventlog_schema = {
  system_id: null,
  category: null,
  host_date: null,
  host_time: null,
  error_type: null,
  num_1: null,
  technical_event_id: null,
  description: null,
  channel_id: null,
  module: null,
  source: null,
  line: null,
  memo: null,
  subsystem_number: null,
  thread_name: null,
  message: null,
  host_datetime: null,
  capture_datetime: null,
  lod: null
};

const logfile_event_history_metadata = {
  system_id: null,
  power_on: null,
  software_version: null,
  host_datetime: null
};

const stt_magnet = {
  system_id: null,
  host_date: null,
  host_time: null,
  header_1: null,
  header_2: null,
  category: null,
  status_value: null,
  test_result_2: null,
  test_result: null,
  message: null,
  host_datetime: null
};

module.exports = {
  ge_mri_gesys_schema,
  siemens_ct_mri,
  siemens_cv_schema,
  philips_ct_eal_schema,
  philips_ct_events_schema,
  phil_mri_logcurrent_schema,
  phil_mri_rmmu_short_schema,
  phil_mri_rmmu_long_schema,
  philips_mri_rmmu_magnet_schema,
  philips_mri_rmmu_history,
  ge_ct_gesys_schema,
  ge_cv_syserror_schema,
  philips_cv_eventlog_schema,
  logfile_event_history_metadata,
  stt_magnet
};
