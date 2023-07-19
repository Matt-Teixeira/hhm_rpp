const extracted_insert = require("../../../persist/extracted_query_builder");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

async function extract(job_id, memo_data, run_log) {
  let note = {
    job_id,
  };

  await addLogEvent(I, run_log, "extract", cal, note, null);

  const data = [];
  const commercial_test_re = /COMMERCIAL_VERSION:/;
  const power_on_test_re = /Power-On Hours:/;

  const software_version_re =
    /COMMERCIAL_VERSION:\s?(?<software_version>\d+(\.\d+)?(\.\d+)?(\.\d+)?)/;
  const power_on_re = /Power-On Hours:\s?(?<power_on>\d+)/;

  try {
    // Loop though memo data extracted from eventlog.js parser
    for (let memo of memo_data) {
      let is_commercial_match = commercial_test_re.test(memo.memo);
      let is_power_match = power_on_test_re.test(memo.memo);

      if (is_commercial_match) {
        const match = memo.memo.match(software_version_re);
        if (match) {
          data.push({
            system_id: memo.system_id,
            name: "software_version",
            value: match.groups.software_version,
            host_datetime: memo.host_datetime,
          });
        }
      }
      if (is_power_match) {
        const match = memo.memo.match(power_on_re);
        if (match) {
          data.push({
            system_id: memo.system_id,
            name: "power_on",
            value: match.groups.power_on,
            host_datetime: memo.host_datetime,
          });
        }
      }
    }

    const dataToArray = data.map(({ ...rest }) => Object.values(rest));

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
    };
    await addLogEvent(E, run_log, "extract", cat, note, error);
  }
}

module.exports = extract;
