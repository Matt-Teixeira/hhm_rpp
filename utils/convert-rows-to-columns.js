const { log } = require("../logger");

const convertRowsToColumns = async (jobId, sme, rows) => {
  // PG INSERT PAYLOADS ARE 2D ARRAYS, EACH SUB ARRAY REPRESENTS A COLUMN OF DATA
  //await log('info', jobId, sme, 'convertRowsToColumns', 'FN CALLED', null);

  const firstRow = rows[0];
  const lastRow = rows[rows.length - 1];
  const dbColumnCount = firstRow.length;

  await log("info", jobId, sme, "convertRowsToColumns", "FN DETAILS", {
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
