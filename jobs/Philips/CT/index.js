("use strict");
require("dotenv").config();
const { log } = require("../../../logger");
const phil_ct_eal = require("./eal_parser");
const phil_ct_events = require("./events_parser");
const { Philips_CT } = require("../../../data_acquisition/Philips_CT");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

const philips_ct_parsers = async (job_id, sysConfigData, run_log) => {
  let note = {
    job_id: job_id,
    sme: sysConfigData.id
  };

  try {
    await addLogEvent(I, run_log, "philips_ct_parsers", cal, note, null);
    await log("info", job_id, sysConfigData.id, "philips_ct_parsers", "FN CALL", {
      sysConfigData,
    });

    for await (const file of sysConfigData.hhm_file_config) {
      switch (file.query) {
        case "eal":
          const Eal_System = new Philips_CT(sysConfigData, file, job_id, run_log);
          await phil_ct_eal(Eal_System);
          break;
        case "events":
          const Events_System = new Philips_CT(sysConfigData, file, job_id, run_log);
          await phil_ct_events(Events_System);
          break;
        default:
          break;
      }
    }
  } catch (error) {
    await addLogEvent(E, run_log, "philips_ct_parsers", cat, note, error);
    await log("error", job_id, sysConfigData.id, "philips_ct_parsers", "FN CATCH", {
      error: error,
    });
  }
};

module.exports = philips_ct_parsers;
