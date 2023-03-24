const extracted_insert = require("../../../persist/extracted_query_builder");
const { log } = require("../../../logger");

async function extract(jobId, extraction_data) {
  const data = [];
  const tube_data_re =
    /scan\sseconds.*=\s(?<scan_seconds>\d+)?.*tubeSerialNo:\s(?<tube_serial_no>\d+).*TubeType:\s(?<tube_type>\w+)/;

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
      jobId,
      dataToArray,
      "logfile_event_history_metadata",
      extraction_data[0].system_id
    );

    if (!insertSuccess)
      throw new Error("logfile_event_history_metadata failed");
  } catch (error) {
    await log(
      "error",
      jobId,
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
