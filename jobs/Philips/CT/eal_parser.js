("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const { philips_re } = require("../../../parse/parsers");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_ct_eal_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

async function phil_ct_eal(
  jobId,
  sysConfigData,
  fileToParse,
  ct_eal_events_blocks
) {
  const sme = sysConfigData.id;
  const data = [];

  try {
    await log("info", jobId, sme, "phil_ct_eal", "FN CALL");

    const eal_block_groups = ct_eal_events_blocks.matchAll(
      philips_re.ct_eal_new
    );

    for (let match of eal_block_groups) {
      match.groups.system_id = sme;
      const dtObject = await generateDateTime(
        "uuid",
        match.groups.system_id,
        fileToParse.pg_table.eal,
        match.groups.host_date,
        match.groups.host_time
      );

      match.groups.host_datetime = dtObject;

      data.push(match.groups);
    }

    const mappedData = mapDataToSchema(data, philips_ct_eal_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const query = { query: fileToParse.query.eal };

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      query
    );
  } catch (error) {
    console.log(error);
    await log("error", jobId, sme, "phil_ct_eal", "FN CALL", {
      error,
    });
  }
}

module.exports = phil_ct_eal;
