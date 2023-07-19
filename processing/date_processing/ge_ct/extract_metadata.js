const extracted_insert = require("../../../persist/extracted_query_builder");
const { log } = require("../../../logger");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

async function extract(job_id, extraction_data, run_log) {
  let note = {
    job_id,
  };
  await addLogEvent(I, run_log, "extract", cal, note, null);
  const data = [];
  try {
    const scan_seconds_re =
      /The current tube usage data reports a total of\s?(?<scan_seconds>\d+\.\d+)/;

    for (const group of extraction_data) {
      const match = group.message.match(scan_seconds_re);
      if (match) {
        data.push({
          system_id: group.system_id,
          name: "scan_seconds",
          value: match.groups.scan_seconds,
          host_datetime: group.host_datetime,
        });
      }
    }

    const dataToArray = data.map(({ ...rest }) => Object.values(rest));

    console.log("\ndataToArray");

    console.log(dataToArray);

    const insertSuccess = await extracted_insert(
      job_id,
      dataToArray,
      "logfile_event_history_metadata",
      data[0].system_id,
      run_log
    );

    if (!insertSuccess)
      throw new Error("logfile_event_history_metadata failed");
  } catch (error) {
    let note = {
      job_id,
      sme: data[0].system_id,
    };
    console.log("\nMETADATA ERROR");
    console.log(error);
    await addLogEvent(E, run_log, "extract", cat, note, error);
    await log(
      "error",
      job_id,
      "ge_ct_metadata",
      "FN CATCH",
      {
        error: error,
      }
    );
  }
}

module.exports = extract;
