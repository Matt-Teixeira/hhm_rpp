const { DateTime } = require("luxon");

async function convertDT(date) {
  let date1 = DateTime.fromFormat(`${date}`, "yyyy-MM-dd");
  let newDate = new Date(date1.toISO());
  return newDate;
}

module.exports = { convertDT };
