const { log } = require("../logger");
const [addLogEvent] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat },
} = require("../utils/logger/enums");

const convertRowsToColumns = async (job_id, sme, rows, run_log) => {
  // PG INSERT PAYLOADS ARE 2D ARRAYS, EACH SUB ARRAY REPRESENTS A COLUMN OF DATA
  //await log('info', job_id, sme, 'convertRowsToColumns', 'FN CALLED', null);
  let note = { job_id };

  const firstRow = rows[0];
  const lastRow = rows[rows.length - 1];
  const dbColumnCount = firstRow.length;

  await addLogEvent(I, run_log, "convertRowsToColumns", cal, note, null);
  await log("info", job_id, sme, "convertRowsToColumns", "FN DETAILS", {
    "FIRST ROW": firstRow,
    "LAST ROW": lastRow,
    "COLUMN COUNT": dbColumnCount,
  });

  const dbPayload = Array.from(new Array(dbColumnCount), () => []);

  rows.forEach((row) => {
    row.forEach((columnValue, idx) => {
      dbPayload[idx].push(columnValue);
    });
  });

  return dbPayload;
};

module.exports = convertRowsToColumns;
