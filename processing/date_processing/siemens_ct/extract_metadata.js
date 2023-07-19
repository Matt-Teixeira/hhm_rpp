const extracted_insert = require("../../../persist/extracted_query_builder");
const { log } = require("../../../logger");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

async function extract(job_id, extraction_data, run_log) {
  const data = [];
  const tube_data_re =
    /scan\sseconds.*=\s(?<scan_seconds>\d+)?.*tubeSerialNo:\s(?<tube_serial_no>\d+).*TubeType:\s(?<tube_type>\w+)/;
    let note = {
      job_id,
    };
    await addLogEvent(I, run_log, "extract", cal, note, null);
  try {
    for (const group of extraction_data) {
      const matches = group.text_group.match(tube_data_re);

      if (matches) {
        for (const property in matches.groups) {
          if (matches.groups[property]) {
            data.push({
              system_id: group.system_id,
              name: property,
              value: matches.groups[property],
              host_datetime: group.host_datetime,
            });
          }
        }
      }
    }

    const dataToArray = data.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await extracted_insert(
      job_id,
      dataToArray,
      "logfile_event_history_metadata",
      extraction_data[0].system_id,
      run_log
    );

    if (!insertSuccess)
      throw new Error("logfile_event_history_metadata failed");
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "extract", cat, note, error);
    await log(
      "error",
      job_id,
      extraction_data[0].system_id,
      "siemens_ct_metadata",
      "FN CATCH",
      {
        error: error,
      }
    );
  }
}

module.exports = extract;
