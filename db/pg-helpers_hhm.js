const pgp = require("pg-promise")();

//const { pg_column_sets: pg_cs } = require('./utils/db/sql/pg-helpers');
//query = pgp.helpers.insert(rows, pg_cs.mag.ge.mm3);

// HELPER FOR LINKING TO EXTERNAL QUERY FILES
const pg_tables = {
  philips: {
    logcurrent: new pgp.helpers.TableName({
      table: "philips_mri_logcurrent",
      schema: "log",
    }),
  },
};

const pg_column_sets = {
  log: {
    philips: {
      logcurrent: new pgp.helpers.ColumnSet(
        [
          "system_id",
          "host_date",
          "host_time",
          "row_type",
          "event_type",
          "subsystem",
          "code_1",
          "code_2",
          "group_1",
          "message",
          "packets_created",
          "data_created_value",
          "size_copy_value",
          "data_8",
          "reconstructor",
          "magnet_meu",
          "host_datetime",
        ],
        { table: pg_tables.philips.logcurrent }
      ),
    },
  },
};

module.exports = { pg_tables, pg_column_sets };

/* 
  {
    system_id: 'SME01138',
    system_reference_number: '41481',
    hospital_name: 'Piedmont Newton Hospital',
    serial_number_magnet: 'WC_150_0458',
    serial_number_meu: 'BB4611',
    LineNo: '0001',
    year: '2023',
    mo: '07',
    dy: '18',
    hr: '07',
    mn: '59',
    ss: '36',
    hs: '70',
    AvgPwr_value: '0101',
    MinPwr_value: '0069',
    MaxPwr_value: '0135',
    AvgAbs_value: '09924',
    AvgPrMbars_value: '00305',
    MinPrMbars_value: '00297',
    MaxPrMbars_value: '00313',
    LHePct_value: '0663',
    LHe2_value: '0000',
    DiffPressureSwitch_state: 'Y',
    TempAlarm_state: 'N',
    PressureAlarm_state: 'N',
    Cerr_state: 'N',
    CompressorReset_state: 'N',
    Chd_value: '15',
    Cpr_value: '15',
    host_datetime: '2023-07-17T07:59:36.700-04:00'
  },
*/