module.exports = queries = {
  GE: {
    MRI: {
      gesys: `
        INSERT INTO log.ge_mri_gesys (
          system_id,
          epoch,
          record_number_concurrent,
          misc_param_1,
          month,
          day,
          host_date,
          host_time,
          year,
          message_number,
          misc_param_2,
          type,
          data_1,
          num_1,
          server,
          task_id,
          task_epoc,
          object,
          exception_class,
          severity,
          function,
          psd,
          coil,
          scan,
          message,
          sr,
          en,
          host_datetime
        )
        SELECT * FROM UNNEST (
          $1::text[], $2::numeric[], $3::numeric[], $4::numeric[], $5::text[], $6::numeric[], $7::text[], $8::time[], $9::numeric[], $10::numeric[], $11::numeric[], $12::text[], $13::text[], $14::numeric[], $15::text[], $16::text[], $17::numeric[], $18::text[], $19::text[], $20::text[], $21::text[], $22::text[], $23::text[], $24::text[], $25::text[], $26::numeric[], $27::numeric[], $28::timestamptz[]
        )
        `,
    },
    CT: {
      gesys: `
      INSERT INTO log.ge_ct_gesys (
        system_id,
        epoch,
        record_number_concurrent,
        misc_param_1,
        month,
        day,
        host_date,
        host_time,
        year,
        message_number,
        misc_param_2,
        type,
        data_1,
        num_1,
        date_2,
        host,
        ermes_number,
        exception_class,
        severity,
        file,
        line_number,
        scan_type,
        warning,
        end_msg,
        message,
        sr,
        en,
        host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::numeric[], $3::numeric[], $4::numeric[], $5::text[], $6::numeric[], $7::text[], $8::time[], $9::numeric[], $10::numeric[], $11::numeric[], $12::text[], $13::text[], $14::numeric[], $15::text[], $16::text[], $17::numeric[], $18::text[], $19::text[], $20::text[], $21::numeric[], $22::text[], $23::text[], $24::text[], $25::text[], $26::numeric[], $27::numeric[], $28::timestamptz[]
      )
      `,
    },
    CV: {
      sysError: `
      INSERT INTO log.ge_cv_syserror (
        system_id,
        sequencenumber,
        host_date,
        host_time,
        subsystem,
        errorcode,
        errortext,
        exam,
        exceptioncategory,
        application,
        majorfunction,
        minorfunction,
        fru,
        viewinglevel,
        rootcause,
        repeatcount,
        debugtext,
        sourcefile,
        sourceline,
        host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::numeric[], $3::date[], $4::text[], $5::text[], $6::numeric[], $7::text[], $8::numeric[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::numeric[], $15::numeric[], $16::numeric[], $17::text[], $18::text[], $19::numeric[], $20::timestamptz[]
      )
      `,
    },
  },
  Siemens: {
    CT: {
      EvtApplication_Today: `
      INSERT INTO log.siemens_ct (
          system_id,
          host_state,
          host_date,
          host_time,
          source_group,
          type_group,
          text_group,
          domain_group,
          id_group,
          month,
          day,
          year,
          host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[], $8::text[], $9::numeric[], $10::text[], $11::numeric[], $12::numeric[], $13::timestamptz[]
      )
      `,
    },
    CV: {
      Evtlog: `
      INSERT INTO log.siemens_cv (
          system_id,
          host_date,
          host_time,
          source_group,
          type_group,
          text_group,
          domain_group,
          id_group,
          month,
          day,
          year,
          host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::time[], $4::text[], $5::numeric[], $6::text[], $7::text[], $8::numeric[], $9::text[], $10::numeric[], $11::numeric[], $12::timestamptz[]
      )
      `,
    },
    MRI: {
      EvtApplication_Today: `
      INSERT INTO log.siemens_mri (
          system_id,
          host_state,
          host_date,
          host_time,
          source_group,
          type_group,
          text_group,
          domain_group,
          id_group,
          month,
          day,
          year,
          host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[], $8::text[], $9::numeric[], $10::text[], $11::numeric[], $12::numeric[], $13::timestamptz[]
      )
      `,
    },
  },
  Philips: {
    CT: {
      eal: `
      INSERT INTO log.philips_ct_eal (
        system_id,
        host_date,
        host_time,
        controller,
        data_type,
        log_number,
        tm_stamp,
        err_type,
        err_number,
        vxw_err_no,
        file,
        line,
        param_1,
        param_2,
        info,
        eal_time,
        host_datetime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::numeric[], $15::text[], $16::text[], $17::timestamptz[]
      )
      `,
      events: `
      INSERT INTO log.philips_ct_events (
      system_id,
      type,
      level,
      module,
      time_stamp,
      host_date,
      host_time,
      message,
      eal,
      blob,
      event_time,
      host_datetime
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[], $10::text[], $11::text[], $12::timestamptz[]
    )
      `,
    },
    MRI: {
      logcurrent: `
      INSERT INTO log.philips_mri_logcurrent (
        system_id,
        host_date,
        host_time,
        row_type,
        event_type,
        subsystem,
        code_1,
        code_2,
        group_1,
        message,
        packets_created,
        data_created_value,
        size_copy_value,
        data_8,
        reconstructor,
        host_datetime
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::date[], $3::time[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::text[], $15::text[], $16::timestamptz[]
    )
      `,
      rmmu_short: `
    INSERT INTO log.philips_mri_rmmu_short(
      system_id,
      system_reference_number,
      hospital_name,
      serial_number_magnet,
      serial_number_meu,
      lineno,
      year,
      mo,
      dy,
      hr,
      mn,
      ss,
      hs,
      AvgPwr_value,
      MinPwr_value,
      MaxPwr_value,
      AvgAbs_value,
      AvgPrMbars_value,
      MinPrMbars_value,
      MaxPrMbars_value,
      LHePct_value,
      LHe2_value,
      DiffPressureSwitch_state,
      TempAlarm_state,
      PressureAlarm_state,
      Cerr_state,
      CompressorReset_state,
      Chd_value,
      Cpr_value,
      host_datetime
  )
  SELECT * FROM UNNEST (
    $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::numeric[], $13::numeric[], $14::numeric[], $15::numeric[], $16::numeric[], $17::numeric[], $18::numeric[], $19::numeric[], $20::numeric[], $21::numeric[], $22::numeric[], $23::text[], $24::text[], $25::text[], $26::text[], $27::text[], $28::numeric[], $29::numeric[], $30::timestamptz[]
  )
    `,
      rmmu_long: `
    INSERT INTO log.philips_mri_rmmu_long(
      system_id,
      system_reference_number,
      hospital_name,
      serial_number_magnet,
      serial_number_meu,
      lineno,
      year,
      mo,
      dy,
      hr,
      mn,
      ss,
      hs,
      dow_value,
      AvgPwr_value,
      MinPwr_value,
      MaxPwr_value,
      AvgAbs_value,
      AvgPrMbars_value,
      MinPrMbars_value,
      MaxPrMbars_value,
      LHePct_value,
      LHe2_value,
      DiffPressureSwitch_state,
      TempAlarm_state,
      PressureAlarm_state,
      Cerr_state,
      CompressorReset_state,
      Chd_value,
      Cpr_value,
      host_datetime
  )
  SELECT * FROM UNNEST (
    $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::numeric[], $13::numeric[], $14::numeric[], $15::numeric[], $16::numeric[], $17::numeric[], $18::numeric[], $19::numeric[], $20::numeric[], $21::numeric[], $22::numeric[], $23::numeric[], $24::text[], $25::text[], $26::text[], $27::text[], $28::text[], $29::numeric[], $30::numeric[], $31::timestamptz[]
  )
    `,
      rmmu_magnet: `
    INSERT INTO log.philips_mri_rmmu_magnet(
      system_id,
      system_reference_number,
      hospital_name,
      serial_number_magnet,
      serial_number_meu,
      lineno,
      year,
      mo,
      dy,
      hr,
      mn,
      ss,
      hs,
      event,
      data,
      descr,
      host_datetime
  )
  SELECT * FROM UNNEST (
    $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::numeric[], $7::numeric[], $8::numeric[], $9::numeric[], $10::numeric[], $11::numeric[], $12::numeric[], $13::numeric[], $14::text[], $15::text[], $16::text[], $17::timestamptz[]
  )
    `,
    },
    CV: {
      EventLog: `
      INSERT INTO log.philips_cv_eventlog(
        system_id,
        category,
        host_date,
        host_time,
        error_type,
        num_1,
        technical_event_id,
        description,
        channel_id,
        module,
        source,
        line,
        memo,
        subsystem_number,
        thread_name,
        message,
        host_datetime
      )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::numeric[], $8::text[], $9::text[], $10::text[], $11::text[], $12::numeric[], $13::text[], $14::numeric[], $15::text[], $16::text[], $17::timestamptz[]
    )
      `,
    },
  },
};
