const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const fs = require("node:fs");
const readline = require("readline");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_cv_eventlog_schema } = require("../../../persist/pg-schemas");
const { blankLineTest } = require("../../../util/regExHelpers");
const execLastMod = require("../../../read/exec-file_last_mod");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");
const execHead = require("../../../read/exec-head");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const extract = require("../../../processing/date_processing/phil_cv/extract_memo_data");
const [addLogEvent] = require("../../../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../../../utils/logger/enums");

const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

async function phil_cv_eventlog(job_id, sysConfigData, file_config, run_log) {
  const sme = sysConfigData.id;
  // an array in each config accossiated with a file
  const parsers = file_config.parsers;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const headPath = "./read/sh/head.sh";
  const lastModPath = "./read/sh/get_dir_last_mod.sh";

  const data = [];
  // Extract 'Power-On hours' and 'Commercial Version'
  const memo_data = [];

  const complete_file_path = `${sysConfigData.hhm_config.file_path}/${file_config.file_name}`;

  let note = {
    job_id,
    sme,
    file: file_config.file_name,
    path: complete_file_path,
  };

  try {
    await addLogEvent(I, run_log, "phil_cv_eventlog", cal, note, null);

    if (!fs.existsSync(complete_file_path)) {
      const file_mod_datetime = await execLastMod(lastModPath, [
        sysConfigData.hhm_config.file_path,
        "archive",
      ]);

      let note = {
        job_id,
        sme,
        file: file_config.file_name,
        path: complete_file_path,
        last_mod: file_mod_datetime + sysConfigData.hhm_config.file_path,
      };
      await addLogEvent(W, run_log, "phil_cv_eventlog", det, note, null);
      return;
    }

    const prevFileSize = await getRedisFileSize(
      sme,
      file_config.file_name,
      run_log
    );

    // START: Check Redis delta. Delta === 0 if file not rotated (previously parsed data)
    const currentFileSize = await getCurrentFileSize(
      sme,
      fileSizePath,
      sysConfigData.hhm_config.file_path,
      file_config.file_name,
      run_log
    );

    const delta = currentFileSize - prevFileSize;

    note.current_file_size = currentFileSize;
    note.delta = delta;

    await addLogEvent(I, run_log, "phil_cv_eventlog", det, note, null);

    if (delta === 0) {
      let note = {
        job_id,
        sme,
        file: file_config.file_name,
        delta: delta,
        message: "Same file size. Do not parse",
      };
      await addLogEvent(I, run_log, "phil_cv_eventlog", det, note, null);
      return;
    }

    // END: Check Redis delta

    // rl is set conditionaly. Holds file data
    let rl;
    // prevFileSize will be null if it is new system (first time running rpp).
    // prevFileSize will be 0 if log has rotated.
    // In both scenarios, read and parse entire file.
    if (prevFileSize === null || prevFileSize === 0 || delta !== 0) {
      rl = readline.createInterface({
        input: fs.createReadStream(complete_file_path),
        crlfDelay: Infinity,
      });
    }

    /*     Old condition prior to node data acquisition app
    if (prevFileSize > 0 && prevFileSize !== null) {
      const currentFileSize = await getCurrentFileSize(
        sme,
        fileSizePath,
        sysConfigData.hhm_config.file_path,
        file_config.file_name
    );

      const delta = currentFileSize - prevFileSize;
      

      if (delta === 0) {
        
        return;
      }

      let headDelta = await execHead(headPath, delta, complete_file_path);

      rl = headDelta.toString().split(/(?:\r\n|\r|\n)/g);
    } 
    */

    for await (const line of rl) {
      let matches = line.match(philips_re.cv[parsers[0]]);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          let note = {
            job_id,
            sme: sme,
            file: file_config,
            line,
            message: "NO MATCH FOUND",
          };
          await addLogEvent(W, run_log, "phil_cv_eventlog", det, note, null);
        }
      } else {
        matches.groups.system_id = sme;

        const dtObject = await generateDateTime(
          job_id,
          matches.groups.system_id,
          file_config.pg_table,
          matches.groups.host_date,
          matches.groups.host_time
        );

        if (dtObject === null) {
          let note = {
            job_id,
            sme: sme,
            line,
            match_group: matches.groups,
            message: "datetime object null",
          };
          await addLogEvent(W, run_log, "phil_cv_eventlog", det, note, null);
        }

        matches.groups.host_datetime = dtObject;

        data.push(matches.groups);
        if (matches.groups.memo !== "") {
          memo_data.push({
            system_id: matches.groups.system_id,
            memo: matches.groups.memo,
            host_datetime: matches.groups.host_datetime,
          });
        }
      }
    }

    // homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, philips_cv_eventlog_schema);

    console.log("\nmappedData - philips_cv");
    console.log(sme);
    console.log(mappedData[mappedData.length - 1]);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(
      mappedData,
      pg_cs.log.philips.philips_cv_eventlog
    );

    await db.any(query);

    // ** End Persist

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await addLogEvent(I, run_log, "phil_cv_eventlog", det, note, null);

    // Update Redis Cache

    await updateRedisFileSize(
      sme,
      updateSizePath,
      sysConfigData.hhm_config.file_path,
      file_config.file_name,
      run_log
    );
    // insert metadata
    if (memo_data.length > 0) await extract(job_id, memo_data, run_log);
  } catch (error) {
    console.log(error);
    await addLogEvent(E, run_log, "phil_cv_eventlog", cat, note, error);
  }
}

module.exports = phil_cv_eventlog;
