const { log } = require("../../../logger");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function initialUpdate(jobId, sme, file_config, data) {
  try {
    await log("info", jobId, sme, "initialUpdate", "FN CALL", {
      file: file_config.file_name,
    });
    let process_type = file_config.aggregation;
    let successful_agg = false;

    switch (process_type) {
      case "max":
        successful_agg = await maxValue(jobId, sme, data, file_config.column);
        break;
      case "min":
        successful_agg = await minValue(jobId, sme, data, file_config.column);
        break;
      case "bool":
        successful_agg = await booleanValue(
          jobId,
          sme,
          data,
          file_config.column
        );
        break;
      default:
        break;
    }
    return successful_agg;
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "initialUpdate", "FN CALL", {
      file: file_config.file_name,
      error: error,
    });
    return false;
  }
}

module.exports = initialUpdate;
