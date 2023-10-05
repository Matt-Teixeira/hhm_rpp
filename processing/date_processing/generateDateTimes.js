const {
  dateTimeTemplate,
  date_minus_one_template
} = require("./dateTimeTemplate");
const { remove__ } = require("./incoming_date_cleaning");

const [addLogEvent] = require("../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf }
} = require("../../utils/logger/enums");

async function generateDateTime(run_log, sme, pgTable, hostDate, hostTime) {
  try {
    let date;
    switch (pgTable) {
      case "siemens_cv":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "stt_magnet":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_mri_rmmu_history":
        date = await date_minus_one_template(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );

        break;
      case "philips_mri_rmmu_magnet":
        date = await date_minus_one_template(
          run_log,
          sme,
          `${hostDate}${hostTime + "0"}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_mri_rmmu_short":
        date = await date_minus_one_template(
          run_log,
          sme,
          `${hostDate}${hostTime + "0"}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_mri_rmmu_long":
        date = await date_minus_one_template(
          run_log,
          sme,
          `${hostDate}${hostTime + "0"}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_mri_logcurrent":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime + "0"}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_ct_events":
        hostTime = remove__(hostTime);
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy/MM/ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_ct_eal":
        hostTime = remove__(hostTime);
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy/MM/ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "ge_ct_gesys":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "mmb.ge_mm3":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyHH:mm",
          "America/New_York"
        );
        break;
      //HHM
      case "log.ge_ct_gesys":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "ge_mri_gesys":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "ge_cv_syserror":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_cv_eventlog":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_ct":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_cv":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_mri":
        date = await dateTimeTemplate(
          run_log,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );
        break;
      default:
        break;
    }
    return date;
  } catch (error) {
    console.log(error);
    let note = {
      sme,
      pgTable,
      hostDate,
      hostTime
    };
    await addLogEvent(E, run_log, "determineManufacturer", cat, note, error);
  }
}

module.exports = generateDateTime;
