const win10_siemens_ct = require("./win10_siemens_ct");
const win10_siemens_mri = require("./win10_siemens_mri");
const Siemens_10 = require("../../../data_acquisition/Siemens_10");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

const win_10_parsers = async (job_id, sysConfigData, file_config, run_log) => {
  let note = {
    job_id,
    sme: sysConfigData.id,
    file_config: file_config,
  };
  await addLogEvent(I, run_log, "win_10_parsers", cal, note, null);

  switch (sysConfigData.modality) {
    case "CT":
      const CT_System = new Siemens_10(
        sysConfigData,
        file_config,
        job_id,
        run_log
      );
      await win10_siemens_ct(CT_System);
      break;
    case "CV/IR":
      //await parse_win_10(job_id, sysConfigData, file_config);
      break;
    case "MRI":
      const MRI_System = new Siemens_10(
        sysConfigData,
        file_config,
        job_id,
        run_log
      );
      await win10_siemens_mri(MRI_System);
      break;
    default:
      break;
  }

  try {
  } catch (error) {
    await addLogEvent(E, run_log, "win_10_parsers", cat, note, error);
  }
};

module.exports = win_10_parsers;
