const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { stt_magnet } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, cat, det },
} = require("../../../utils/logger/enums");

async function stt_parser(file_config, System) {
  const parsers = file_config.stt_magnet.parsers;
  const data = [];

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: file_config,
  };

  await System.getRedisFileSize();

  await System.getCurrentFileSize();

  await System.getFileData();

  if (System.file_data === null) return;

  let line_number = 1;
  for await (const line of System.file_data) {
    let matches = await line.match(philips_re[parsers[0]]);

    console.log(matches);

    if (matches === null) {
      const isNewLine = blankLineTest(line);
      if (isNewLine) {
        line_number++;
        continue;
      } else {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          file: file_config,
          message: "This is not a blank or new line - Bad Match",
          line,
          line_number,
        };
        await addLogEvent(I, System.run_log, "stt_parser", cal, note, null);
        line_number++;
        continue;
      }
    } else if (matches.groups === undefined) continue;
    else {
      line_number++;
      matches.groups.system_id = System.sme;

      // 23-JUL-2023 03:06:20.81
      // Add 0 to end of time string for Lexon: 03:06:20.81 = 03:06:20.810
      matches.groups.host_time += "0";

      const dtObject = await generateDateTime(
        System.job_id,
        matches.groups.system_id,
        "stt_magnet",
        matches.groups.host_date,
        matches.groups.host_time
      );

      // magnet_meu group does not have datetime. Ex: '0114,2022,04,01,00,06,08,17,14,00000,'
      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          file: file_config,
          line,
          match_group: matches.groups,
          message: "date_time object null",
        };
        await addLogEvent(W, run_log, "phil_mri_logcurrent", det, note, null);
        await log("warn", job_id, System.sme, "date_time", "FN CALL", {
          message: "date_time object null",
          date: matches.groups.host_date,
          time: matches.groups.host_time,
          line,
          line_number,
        });
      }

      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);
    }
  }
  console.log(data[99]);

  // Homogenize data to prep for insert to db
  const mappedData = mapDataToSchema(data, stt_magnet);
  const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

  // ** End Parse

  // ** Begin Persist

  const insertSuccess = await bulkInsert(
    System.job_id,
    dataToArray,
    System.sysConfigData,
    System.file_config.stt_magnet,
    System.run_log
  );

  // ** End Persist

  // Update Redis Cache

  if (insertSuccess) {
    await System.updateRedisFileSize();
  }
}

module.exports = stt_parser;
