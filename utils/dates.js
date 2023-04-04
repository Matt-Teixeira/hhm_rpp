const { DateTime } = require("luxon");

async function convertDT(date) {
  const date_format_tests = {
    re_1: /\d{4}-\d+-\d{2}/,
    re_2: /\d{2}-[A-Z]+-\d{4}/,
  };

  let formatted_date;

  if (date_format_tests.re_1.test(date)) {
    formatted_date = DateTime.fromFormat(`${date}`, "yyyy-MM-dd");
  }
  if (date_format_tests.re_2.test(date)) {
    formatted_date = DateTime.fromFormat(`${date}`, "dd-MMM-yyyy");
  }

  let newDate = new Date(formatted_date.toISO());
  return newDate;
}

module.exports = { convertDT };
