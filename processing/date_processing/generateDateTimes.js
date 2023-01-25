const { log } = require("../../logger");
const dateTimeTemplate = require("./dateTimeTemplate");

async function generateDateTime(jobId, sme, pgTable, hostDate, hostTime) {
  try {
    let date;
    switch (pgTable) {
      case "philips_ct_events":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy/MM/ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_ct_eal":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy/MM/ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "ge_ct_gesys":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "mmb.ge_mm3":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyHH:mm",
          "America/New_York"
        );
        break;
      //HHM
      case "log.ge_ct_gesys":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "ge_mri_gesys":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "ge_cv_syserror":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss.SSS",
          "America/New_York"
        );
        break;
      case "philips_cv_eventlog":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_ct":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "yyyy-MM-ddHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_cv":
        date = await dateTimeTemplate(
          jobId,
          sme,
          `${hostDate}${hostTime}`,
          "dd-MMM-yyyyHH:mm:ss",
          "America/New_York"
        );
        break;
      case "siemens_mri":
        date = await dateTimeTemplate(
          jobId,
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
    await log("error", jobId, sme, "generateDateTime", "FN CATCH", {
      error: error,
    });
  }
}

module.exports = generateDateTime;
