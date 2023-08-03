const db = require("../../../utils/db/pg-pool");
const pgp = require("pg-promise")();
const { win_10_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { siemens_ct_mri } = require("../../../persist/pg-schemas");
const { blankLineTest } = require("../../../util/regExHelpers");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");
const execLastMod = require("../../../read/exec-file_last_mod");
const extract = require("../../../processing/date_processing/siemens_ct/extract_metadata");
const {
  pg_column_sets: pg_cs,
} = require("../../../utils/db/sql/pg-helpers_hhm");

/*
NOTE ON EvtApplication_Today.txt
This file turns over on a 24 hour intervolve; however, it also accumulates data throughout the day.
New data is added to file head. 
*/

const win10_siemens_ct = async (System) => {
  const data = [];
  const extracted_metadata = [];

  lastModPath = "./read/sh/get_file_last_mod.sh";

  let line_num = 1;
  // first_line will be the most recent line data
  let first_line;

  let note = {
    job_id: System.job_id,
    sme: System.sme,
    file: System.fileToParse,
  };

  try {
    await System.addLogEvent(
      System.I,
      System.run_log,
      "win10_siemens_ct",
      System.cal,
      note,
      null
    );

    await System.get_redis_line();

    // Returns true if file in dir.
    if (!System.is_file_present()) return;

    await System.get_file_data();

    for await (const line of System.file_data) {
      // Save first line (most resent parsed line) to redis
      // This process of delimiting new and old data only works because new data is appended to top
      if (line_num === 1) first_line = line;

      // If line (in file) === redis_line, we break because we have reached point of last rpp.
      if (line == System.redis_line) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          file: System.fileToParse,
          message: `End of new data`,
        };
        // Log file's last mod datetime
        const file_mod_datetime = await execLastMod(lastModPath, [
          System.complete_file_path,
        ]);
        note.last_mod = file_mod_datetime;
        await System.addLogEvent(
          System.W,
          System.run_log,
          "win10_siemens_ct",
          System.cal,
          note,
          null
        );
        break;
      }

      let matches = line.match(win_10_re[System.parsers[0]]);

      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          let note = {
            job_id: System.job_id,
            sme: System.sme,
            file: System.fileToParse,
            message: "This is not a blank new line - Bad Match",
            line: line,
          };
          await System.addLogEvent(
            System.W,
            System.run_log,
            "win10_siemens_ct",
            System.cal,
            note,
            null
          );
        }
      }

      matches.groups.system_id = System.sme;

      const dtObject = await generateDateTime(
        System.job_id,
        matches.groups.system_id,
        System.fileToParse.pg_table,
        matches.groups.host_date,
        matches.groups.host_time
      );

      if (dtObject === null) {
        let note = {
          job_id: System.job_id,
          sme: System.sme,
          line,
          match_group: matches.groups,
          message: "date_time object null",
        };
        await System.addLogEvent(
          System.W,
          System.run_log,
          "win10_siemens_ct: date_time",
          System.det,
          note,
          null
        );
      }

      matches.groups.host_datetime = dtObject;

      data.push(matches.groups);

      const scan_sec_test_re = /scan\sseconds/;
      if (scan_sec_test_re.test(matches.groups.text_group)) {
        extracted_metadata.push({
          system_id: matches.groups.system_id,
          text_group: matches.groups.text_group,
          host_datetime: matches.groups.host_datetime,
        });
      }

      line_num++;
    }

    // No data in array if most recently parsed line in redis === first line in file. Indication of no change in file.
    // Logged above
    if (data.length === 0) return;

    const mappedData = mapDataToSchema(data, siemens_ct_mri);

    // ** End Parse

    // ** Begin Persist

    const query = pgp.helpers.insert(mappedData, pg_cs.log.siemens.siemens_ct);

    await db.any(query);

    // ** End Persist

    note.number_of_rows = mappedData.length;
    note.first_row = mappedData[0];
    note.last_row = mappedData[mappedData.length - 1];
    note.message = "Successful Insert";

    await System.addLogEvent(
      System.I,
      System.run_log,
      "win10_siemens_ct",
      System.det,
      note,
      null
    );

    // Update Redis Cache

    await System.update_redis_line(first_line);
    if (extracted_metadata.length > 0)
      await extract(System.job_id, extracted_metadata, System.run_log);

    return true;
  } catch (error) {
    console.log(error);
    await System.addLogEvent(
      System.E,
      System.run_log,
      "win10_siemens_ct",
      System.cat,
      note,
      error
    );
  }
};

module.exports = win10_siemens_ct;
