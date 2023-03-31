const { log } = require("../../../logger");
const maxValue = require("./maxValue");
const booleanValue = require("./booleanValue");
const minValue = require("./minValue");

async function initialUpdate(jobId, sme, file_config, data) {
  try {
    await log("info", jobId, sme, "initialUpdate", "FN CALL", {
      file: file_config.file_name,
    });
    let process_type = file_config.aggregation
    
    switch (process_type) {
      case "max":
        await maxValue(jobId, sme, data, file_config.column);
        break;
      case "min":
        await minValue(jobId, sme, data, file_config.column);
        break;
      case "bool":
        await booleanValue(jobId, sme, data, file_config.column);
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "initialUpdate", "FN CALL", {
      file: file_config.file_name,
      error: error,
    });
  }
}

module.exports = initialUpdate;
