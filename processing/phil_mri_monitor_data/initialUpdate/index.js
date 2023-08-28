const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

async function initialUpdate(job_id, sme, file_config, data, run_log) {
  let process_type = file_config.aggregation;
  let successful_agg = false;
  let note = {
    job_id,
    sme,
    file: file_config.file_name,
    process_type,
  };
  try {
    await addLogEvent(I, run_log, "initialUpdate", cal, note, null);

    switch (process_type) {
      case "max":

        successful_agg = await maxValue(job_id, sme, data, file_config.column);
        break;
      case "min":
        successful_agg = await minValue(job_id, sme, data, file_config.column);
        break;
      case "bool":
        successful_agg = await booleanValue(
          job_id,
          sme,
          data,
          file_config.column
        );
        break;
      default:
        break;
    }
    note.successful_agg = successful_agg;
    await addLogEvent(I, run_log, "initialUpdate", det, note, null);
    return successful_agg;
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "initialUpdate", cat, note, error);
    return false;
  }
}

module.exports = initialUpdate;
