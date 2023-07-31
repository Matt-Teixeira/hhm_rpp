const { log } = require("../../../logger");
const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { ge_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { ge_mri_gesys_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("../../../utils/logger/enums");

const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

async function ge_mri_gesys(System) {
  // an array in each config accossiated with a file
  const parsers = System.fileToParse.parsers;
  const data = [];

  let note = {
    job_id: System.job_id,
  };

  try {
    await addLogEvent(I, System.run_log, "ge_mri_gesys", cal, note, null);
    await log(
      "info",
      System.job_id,
      System.sysConfigData.id,
      "ge_mri_gesys",
      "FN CALL"
    );

    // ** Start Data Acquisition

    await System.getRedisFileSize();

    await System.getCurrentFileSize();

    await System.getFileData();

    if (System.file_data === null) return;

    // ** End Data Acquisition

    // ** Begin Parse

    let matches = System.file_data.match(ge_re.mri.gesys[parsers[0]]);

    for await (let match of matches) {
      const matchGroups = match.match(ge_re.mri.gesys[parsers[1]]);
      // matchGroups will be null if no match
      if (!matchGroups) {
        let note = {
          job_id: System.job_id,
          sme: System.sysConfigData.id,
          message: "Failed match",
          prev_epoch: data[data.length - 1].epoch,
          sr_group: data[data.length - 1].sr,
        };
        await addLogEvent(W, System.run_log, "ge_mri_gesys", det, note, null);
        await log(
          "error",
          System.job_id,
          System.sysConfigData.id,
          "ge_mri_gesys",
          "FN CALL",
          {
            message: "Failed match",
            prev_epoch: data[data.length - 1].epoch,
            sr_group: data[data.length - 1].sr,
          }
        );
        continue;
      }

      matchGroups.groups.host_date = `${
        matchGroups.groups.day.length === 1
          ? 0 + matchGroups.groups.day
          : matchGroups.groups.day
      }-${matchGroups.groups.month}-${matchGroups.groups.year}`;

      matchGroups.groups.system_id = System.sysConfigData.id;

      const dtObject = await generateDateTime(
        System.job_id,
        matchGroups.groups.system_id,
        System.fileToParse.pg_table,
        matchGroups.groups.host_date,
        matchGroups.groups.host_time
      );

      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sysConfigData.id,
          message: "date_time object null",
        };
        await addLogEvent(W, System.run_log, "ge_mri_gesys", det, note, null);
        await log(
          "warn",
          System.job_id,
          System.sysConfigData.id,
          "date_time",
          "FN CALL",
          {
            message: "date_time object null",
          }
        );
      }

      matchGroups.groups.host_datetime = dtObject;

      data.push(matchGroups.groups);
    }

    const mappedData = mapDataToSchema(data, ge_mri_gesys_schema);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.ge.ge_mri_gesys);

    await db.any(query);

    // ** End Persist

    // Update Redis Cache

    await System.updateRedisFileSize();
    
  } catch (error) {
    let note = {
      job_id: System.job_id,
      sme: System.sysConfigData.id,
    };
    await addLogEvent(E, System.run_log, "ge_mri_gesys", cat, note, error);
    await log(
      "error",
      System.job_id,
      System.sysConfigData.id,
      "ge_mri_gesys",
      "FN CALL",
      {
        error: error.message,
      }
    );
  }
}

module.exports = ge_mri_gesys;
