const win_7_re = {
  big_group:
    /(?<big_group>Source.*(\r\n)Domain:.*(\r\n)Type:.*(\r\n)ID:.*(\r\n)Date:.*(\r\n)Text:.*)/g,
  small_group:
    /Source:(?<source_group>.*)(\r\n)Domain:(?<domain_group>.*)(\r\n)Type:(?<type_group>.*)(\r\n)ID:(?<id_group>.*)(\r\n)(Date:.*\s(?<month>\w+)\s(?<day>\d+),\s(?<year>\d+),\s(?<host_time>.*))(\r\n)Text:(?<text_group>.*)\n?/,
};

const win_10_re = {
  re_v1:
    /(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<host_time>\d{2}:\d{2}:\d{2})\t(?<source_group>(.*?(\d+)?)(\.\d\.\d)?)\t?\s?(?<type_group>(\d{1,5}))\t(?<text_group>.*)/,
  re_v2:
    /(?<host_time>\d{2}:\d{2}:\d{2})\t(?<host_state>\w+)\t(?<host_date>\d{4}-\d{1,2}-\d{1,2})\t(?<source_group>(.*?(\d+)?)(\.\d\.\d)?)\t?\s?(?<type_group>(\d{1,5}))\t(?<text_group>.*)/,
};

const ge_re = {
  test: {
    for_box: /|/,
    for_exception_class: /Exception\sClass\s?:/,
    for_task_id: /Task\sID:/,
  },
  mri: {
    gesys: {
      block: /SR\s(\d+).*?EN\s\1/gs, ///(?<block>SR(.+)((\r?\n.+)*)[\r\n]+(.+)((\r?\n.+)*)[\n\r]+EN\s\d+)/g
      new: /(?:SR\s(?<sr>.+?)[\n\r])(?<epoch>.+?)\s(?<record_number_concurrent>.+?)\s(?<misc_param_1>.+?)\s\w+\s(?<month>.+?)\s+(?<day>.+?)\s(?<host_time>.+?)\s(?<year>.+?)\s(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?.+?)\s+(?<type>.+?)[\n\r]((?<data_1>.*?)\s?)\s+(?<num_1>(-)?\d+?)[\n\r]\s(?:Server\sName:\s(?<server>.+?)[\n\r])?(?:Task ID: (?<task_id>.+?)\s+Time: (?<task_epoc>.+?)\s+Object: (?<object>.+?)[\n\r])?(?:Exception\s?Class:\s?(?<exception_class>.+?)\s+)?(?:Severity:\s(?<severity>.+?)[\n\r])?(?:Function:\s(?<function>.+?)[\n\r])?(?:PSD:\s(?<psd>.+?)\s+Coil:\s(?<coil>.+?)\s+Scan:\s(?<scan>.+?)[\n\r])?(?<message>.+?)(?:EN\s(?<en>\d+))/s, //(?:SR\s(?<sr>.+?)[\n\r])(?<epoch>.+?)\s(?<record_number_concurrent>.+?)\s(?<misc_param_1>.+?)\s\w+\s(?<month>.+?)\s+(?<day>.+?)\s(?<host_time>.+?)\s(?<year>.+?)\s(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?.+?)\s+(?<type>.+?)[\n\r]((?<data_1>.*?)\s)\s+(?<num_1>.+?)[\n\r]\s(?:Server\sName:\s(?<server>.+?)[\n\r])?(?:Task ID: (?<task_id>.+?)\s+Time: (?<task_epoc>.+?)\s+Object: (?<object>.+?)[\n\r])?(?:Exception\s?Class:\s?(?<exception_class>.+?)\s+)?(?:Severity:\s(?<severity>.+?)[\n\r])?(?:Function:\s(?<function>.+?)[\n\r])?(?:PSD:\s(?<psd>.+?)\s+Coil:\s(?<coil>.+?)\s+Scan:\s(?<scan>.+?)[\n\r])?(?<message>.+?)(?:EN\s(?<en>\d+))
    },
  },
  ct: {
    gesys: {
      block: /SR\s(\d+).*?EN\s\1/gs,
      new: /(?:SR\s(?<sr>.+?)[\n\r])(?<epoch>.+?)\s(?<record_number_concurrent>.+?)\s(?<misc_param_1>.+?)\s\w+\s(?<month>.+?)\s+(?<day>.+?)\s(?<host_time>.+?)\s(?<year>.+?)\s(?<message_number>(-)?\d+)\s(?<misc_param_2>(-)?.+?)\s+(?<type>.+?)[\n\r]((?<data_1>.*?)\s?)\s+(?<num_1>(-)?\d+?)[\n\r]\s(?:(?<date_2>.+\d{2}:\d+\s\d{4}?)\s?[\n\r](?:Host\s:\s(?<host>.+?))?\s+(?:Ermes\s\#\s:\s(?<ermes_number>.+?))?[\n\r](?:Exception Class\s:\s(?<exception_class>.+?)\s+)(?:Severity\s:\s(?<severity>.+?))?[\n\r](?:File\s:\s(?<file>.+?)\s+Line\#\s:\s(?<line_number>\d+))?[\n\r])?(?:Function\s?:\s?(.+?)[\n\r])?(?:Scan\sType\s?:\s?(?<scan_type>.+?)[\n\r])?([A-Z]+\s?:\s?(?<warning>.+?)[\n\r])?(?:End:\s(?<end_msg>.+?)[\n\r])?(?<message>.*?)?\s?(?:EN\s(?<en>\d+))/s,
      // add - sign to num_1 filed
    },
  },
  cv: {
    sys_error:
      /(?<sequencenumber>.+?),(?<host_date>.+?),(?<host_time>.+?),(?<subsystem>.+?),(?<errorcode>.+?),(?<errortext>.+?),(?<exam>.+?),(?<exceptioncategory>.+?),(?<application>.+?),(?<majorfunction>.+?),(?<minorfunction>.+?),(?<fru>.+?),(?<viewinglevel>.+?),(?<rootcause>.+?),(?<repeatcount>.+?),(?<debugtext>".+"?|.+?),(?<sourcefile>.+?),(?<sourceline>.+)/,
  },
};

const philips_re = {
  ct_eal_events_blocks:
    /\[reading] : EALInfo(?<eal_info_block>.*)\[\/reading] : EALInfo.*?\[reading] : Events(?<events_block>.*)\[\/reading] : Events/s,
  ct_eal:
    /(?<line>.*?)[|](?<err_type>.*?)[|](?<tmstamp>.*?)[|](?<file>.*?)[|](?<datatype>.*?)[|](?<param1>.*?)[|](?<errnum>.*?)[|](?<info>.*?)(\s+)?[|](?<dtime>.*?)[|](?<ealtime>.*?)[|](?<lognumber>.*?)[|](?<param2>.*?)[|](?<vxwerrno>.*?)[|](?<controller>.*?)?/,
  ct_eal_new:
    /"(?<host_date>.*?)\s(?<host_time>.*?)",(?<controller>.*?),"(?<data_type>.*?)",(?<log_number>.*?),(?<tm_stamp>.*?),"(?<err_type>.*?)",(?<err_number>.*?),(?<vxw_err_no>.*?),(?<file>.*?),(?<line>.*?),(?<param_1>.*?),(?<param_2>.*?),"?(?<info>.*?)"?,"(?<eal_time>.*?)"?[\r\n]/gs,
  ct_events_new:
    /"(?<type>.*?)",(?<level>.*?),"?(?<module>.*?)"?,(?<time_stamp>.*?),"(?<host_date>.*?)\s(?<host_time>.*?)","?(?<message>.*?)"?,"?(?<eal>.*?)"?,"?(?<blob>.*?),?"?,"(?<event_time>.*?)"/gs,
  ct_events:
    /(?<eventtime>.*?)[|](?<blob>.*?)[|](?<type>.*?)[|](?<tstampnum>.*?)[|](?<eal>.*?)[|](?<level>.*?)[|](?<ermodulernum>.*?)[|](?<dtime>.*?)[|](?<msg>.*)?/,
  mri_logcurrent:
    /((?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2}\.\d+)\s(?<row_type>\w+)\s(?<event_type>\w+)\s(?<subsystem>.*?)\s+(?<code_1>\w+)\s(?<code_2>\w+)(\s(?<group_1>\w+))?\s+(?<message>.*))|(Number\sof\sPackets\sCreated\s:\s(?<packets_created>\d*\.?\d*)|Total\sSize\sof\sData\sCreated\s:\s(?<data_created_value>\d*\.?\d*)\s[A-Z]+|Size\sof\sCopy\sDone\s:\s(?<size_copy_value>\d*\.?\d*)\s[A-Z]+|(?<data_8>>.*)|(?<reconstructor>[A-Za-z].*))/,
  cv: {
    eventlog:
      /(?<category>[\w\. \-\$&\.]+)�(?<host_date>[\d-]+)�(?<host_time>[\d:]+)�(?<error_type>\w*)�(?<num_1>\d+)�(?:Technical ?Event ?ID: {1,3}(?<technical_event_id>\d+) ?�Description: (?<description>[^�\r\n]+)�Channel Identification: (?<channel_id>[^�]+)�Module: (?<module>[^�]+)�Source [Ff]ile: (?<source>[^�]+)�Line Number: (?<line>\d+) ?�Memo: ?(?<memo>[^\r\n�]*)(?:�SubsystemNumber: (?<subsystem_number>\d+)�ThreadName: ?(?<thread_name>[\w \-]*))?|(?<message>[^\r\n]*))/,
    eventlogsystem:
      /(?<subject>.*?)�(?<host_date>.*?)�(?<host_time>.*?)�(?<info_1>.*?)�(?<num_1>.*?)�((?<info_2>.*?)[\n|�])?((?<info_3>.*?)[\n|�])?((?<info_4>.*?)[\n|�])?((?<info_5>.*?)[\n|�])?((?<info_6>.*?)[\n|�])?/,
  },
  mri: {
    rmmu_meta_data:
      /System.*:(?<system_reference_number>\d+)\s+Hospital.*:(?<hospital_name>.*)\s+Serial.*:(?<serial_number_magnet>.*)\s+Serial.*:(?<serial_number_meu>.*)/,
    rmmu_long_re:
      /(?<LineNo>\d+),(?<year>\d+),(?<mo>\d+),(?<dy>\d+),(?<hr>\d+),(?<mn>\d+),(?<ss>\d+),(?<hs>\d+),(?<dow_value>\d+),(?<AvgPwr_value>\d+),(?<MinPwr_value>\d+),(?<MaxPwr_value>\d+),(?<AvgAbs_value>\d+),(?<AvgPrMbars_value>\d+),(?<MinPrMbars_value>\d+),(?<MaxPrMbars_value>\d+),(?<LHePct_value>\d+),(?<LHe2_value>\d+),(?<DiffPressureSwitch_state>[YN]+?),(?<TempAlarm_state>[YN]+?),(?<PressureAlarm_state>[YN]+?),(?<Cerr_state>[YN]+?),(?<CompressorReset_state>[YN]+?),(?<Chd_value>\d+),(?<Cpr_value>\d+)/g,
    rmmu_short_re:
      /(?<LineNo>\d+),(?<year>\d+),(?<mo>\d+),(?<dy>\d+),(?<hr>\d+),(?<mn>\d+),(?<ss>\d+),(?<hs>\d+),(?<AvgPwr_value>\d+),(?<MinPwr_value>\d+),(?<MaxPwr_value>\d+),(?<AvgAbs_value>\d+),(?<AvgPrMbars_value>\d+),(?<MinPrMbars_value>\d+),(?<MaxPrMbars_value>\d+),(?<LHePct_value>\d+),(?<LHe2_value>\d+),(?<DiffPressureSwitch_state>[YN]+?),(?<TempAlarm_state>[YN]+?),(?<PressureAlarm_state>[YN]+?),(?<Cerr_state>[YN]+?),(?<CompressorReset_state>[YN]+?),(?<Chd_value>\d+),(?<Cpr_value>\d+)/g,
    rmmu_magnet:
      /(?<LineNo>\d+?),(?<year>\d+?),(?<mo>\d+?),(?<dy>\d+?),(?<hr>\d+?),(?<mn>\d+?),(?<ss>\d+?),(?<hs>\d+?),(?<Event>\d+?),(?<Data>\d+?),(?<Descr>.*)/g,
    rmmu_history:
      /(?<Time>\d+?),(?<Stat>\d+?),(?<AvgPwr>\d+?),(?<MinPwr>\d+?),(?<MaxPwr>\d+?),(?<MinPr>\d+?),(?<MaxPr>\d+?),(?<LHe1>\d+?),(?<LHe2>\d+?),(?<DPS>\d+?),(?<TALM>\d+?),(?<PALM>\d+?),(?<CRes>\d+?)/g,
    monitor: {
      monitor_1HRFAmp1_AvgPower:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<avg_power>(-)?\d+(\.\d+)?)/g,
      monitor_1HRFAmp1_PredAvgPower:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<predicted_avg_power>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_AvgPhix:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<avg_linear_phase_error>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_Delay:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<delay_aq_samples>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_MaxDevPHPhi0:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_dev_offset_phase>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_MaxDevPHPhix:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_dev_linear_phase>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_MaxDevPHSig:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_rel_dev_signal>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_MaxPHPhaseRes:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<avg_phase_residue_coil_max>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_MinPHPhaseRes:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<avg_phase_residue_coil_min>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_OutlierPHPhi0:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_dev_divided_sd_phase_diff>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_OutlierPHPhix:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_dev_divide_sd_lin_phase_diff>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_OutlierPHSig:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_dev_divide_sd_signal_str>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_StdDevPHPhi0:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<sd_offset_phase>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_StdDevPHPhix:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<sd_lin_phase_diff>(-)?\d+(\.\d+)?)/g,
      monitor_EPI_StdDevPHSig:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<relative_sd_signal_str>(-)?\d+(\.\d+)?)/g,
      monitor_PrepShim_LinewidthChange:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<change_linewidth_ashs>(-)?\d+(\.\d+)?)/g,
      monitor_PrepShim_PowsumChange:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<pow_sum_change>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_MaxSpecSpikePower:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<max_spec_spike_pow>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_NoisePower:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<avg_noise_power_per_samp>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_NrAboveThreshold1:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<samples_above_thresh_1>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_NrAboveThreshold2:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<samples_above_thresh_2>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_NrAboveThreshold3:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<samples_above_thresh_3>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_NrSuppressed:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<num_spikes_suspended>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_PowerAboveThreshold1:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<power_samples_above_thresh_1>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_PowerAboveThreshold2:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<power_samples_above_thresh_2>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_PowerAboveThreshold3:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<power_samples_above_thresh_3>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_QPI:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<est_iq_impact>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_QPIAfterCorrection:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<est_qpi_aft_corr>(-)?\d+(\.\d+)?)/g,
      monitor_Spikes_ScanName:
        /(?<!:\s)(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<scan_name>.+)/g,
      monitor_Spikes_SpikeNoiseFraction:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<est_spike_noise_fraction>(-)?\d+(\.\d+)?)/g,
      monitor_System_HumExamRoom:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<exam_room_humidity>(-)?\d+(\.\d+)?)/g,
      monitor_System_HumTechRoom:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<tech_room_humidity_value>(-)?\d+(\.\d+)?)/g,
      monitor_System_TempExamRoom:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<exam_room_temp>(-)?\d+(\.\d+)?)/g,
      monitor_System_TempTechRoom:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<tech_room_temp_value>(-)?\d+(\.\d+)?)/g,
      monitor_cryocompressor_bypass:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<cryo_comp_bypass_status>(-)?\d+(\.\d+)?)/g,
      monitor_cryocompressor_cerr:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<cryo_comp_comm_error_state>(-)?\d+(\.\d+)?)/g,
      monitor_cryocompressor_palm:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<cryo_comp_press_alarm_value>(-)?\d+(\.\d+)?)/g,
      monitor_cryocompressor_talm:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<cryo_comp_temp_alarm_value>(-)?\d+(\.\d+)?)/g,
      monitor_cryocompressor_time_status:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<cryo_comp_malf_value>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_b0_heater_on:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<bo_heater_switch>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_helium_level_status:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<helium_level_status>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_helium_level_value:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<helium_level_value>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_helium_refill_level:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<helium_refill_level>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_lt_boiloff:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<long_term_boil_off_value>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_pressure_dps:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<mag_dps_status_value>(-)?\d+(\.\d+)?)/g,
      monitor_magnet_quench:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<quenched_state>\d+)/g,
      monitor_magnet_under_pressure:
        /(?<host_date>\d{4}-\d{2}-\d{2})\s(?<host_time>\d{2}:\d{2}:\d{2})\s(?<mag_dps_status_days>(-)?\d+(\.\d+)?)/g,
    },
  },
};

module.exports = {
  win_7_re,
  win_10_re,
  ge_re,
  philips_re,
};
