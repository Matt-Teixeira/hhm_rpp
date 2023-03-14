const extracted_insert = require("../../../persist/extracted_query_builder");
const { log } = require("../../../logger");

async function extract(jobId, extraction_data) {
  
 try {
  const data = [];
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

  const insertSuccess = await extracted_insert(
    jobId,
    dataToArray,
    "logfile_event_history_metadata",
    data[0].system_id
  );

  console.log(data)

  if (!insertSuccess) throw new Error("logfile_event_history_metadata failed");
 } catch (error) {
  await log("error", jobId, data[0].system_id, "onBoot", "FN CATCH", {
    error: error,
  });
 }
}

module.exports = extract;
