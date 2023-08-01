const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { log } = require("../../../logger");
const { win_10_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../../persist/pg-schemas");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const execLastMod = require("../../../read/exec-file_last_mod");

const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

/* NOTE ON EvtApplication_Today.txt
  This file turns over on a 24 hour intervolve; however, it also accumulates data throughout the day.
  New data is added to file head. 
*/

const win10_siemens_mri = async (System) => {
  const data = [];
  lastModPath = "./read/sh/get_file_last_mod.sh";

  let line_num = 1;
  // first_line will be the most recent line data
  let first_line;

  try {
    await log("info", System.jobId, System.sme, "win10_siemens_mri", "FN CALL");

    await System.get_redis_line();

    // Returns true if file in dir.
    if (!System.is_file_present()) return;

    await System.get_file_data();

    for await (const line of System.file_data) {
      // Save first line (most resent parsed line) to redis
      // This process of delimiting new and old data only works because new data is appended to top of
      if (line_num === 1) first_line = line;

      // If line (in file) === redis_line, we break because we have reached point of last rpp.
      if (line == System.redis_line) {
        // Log file's last mod datetime
        const file_mod_datetime = await execLastMod(lastModPath, [
          System.complete_file_path,
        ]);
        await log("warn", System.jobId, System.sme, "getFileData", "FN CALL", {
          message: `No delta measured`,
          last_mod: file_mod_datetime,
        });
        break;
      }

      let matches = line.match(win_10_re[System.parsers[0]]);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log(
            "error",
            System.jobId,
            System.sme,
            "Not_New_Line",
            "FN CALL",
            {
              message: "This is not a blank new line - Bad Match",
              line: line,
            }
          );
        }
      }

      matches.groups.system_id = System.sme;

      const dtObject = await generateDateTime(
        System.jobId,
        matches.groups.system_id,
        System.fileToParse.pg_table,
        matches.groups.host_date,
        matches.groups.host_time
      );

      if (dtObject === null) {
        await log("warn", System.jobId, System.sme, "date_time", "FN CALL", {
          message: "date_time object null",
        });
      }

      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);
      line_num++;
    }

    // No data in array if most recently parsed line in redis === first line in file. Indication of no change in file.
    // Logged above
    if (data.length === 0) return;

    const mappedData = mapDataToSchema(data, siemens_ct_mri);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.siemens.siemens_mri);

    await db.any(query);

    // ** End Persist

    // Update Redis Cache

    await System.update_redis_line(first_line);

    return true;
  } catch (error) {
    console.log(error);
    await log(
      "error",
      System.jobId,
      System.sme,
      "win10_siemens_mri",
      "FN CATCH",
      {
        line: line_num,
        error: error,
      }
    );
  }
};

module.exports = win10_siemens_mri;
