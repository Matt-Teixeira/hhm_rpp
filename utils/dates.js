const { log } = require("../logger");
const { DateTime } = require("luxon");

const monthMap = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

async function convertDates(matchGroup, version) {
  switch (version) {
    case "type_1":
      type_1(matchGroup);
      break;
    case "type_2":
      type_2(matchGroup);
      break;
    case "type_3":
      type_3(matchGroup);
      break;
    case "type_4":
      type_4(matchGroup);
      break;
    default:
      break;
  }
}

async function type_1(matchGroup) {
  try {
    const date_time_split = matchGroup.dtime.split(" ");

    const year = date_time_split[0].split("/")[0];
    const month = date_time_split[0].split("/")[1];
    const day = date_time_split[0].split("/")[2];

    const timeRe = /(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/;
    const timeMatches = date_time_split[1].match(timeRe);

    const dt = DateTime.fromObject({
      day,
      month,
      year,
      hour: timeMatches.groups.hour,
      minute: timeMatches.groups.minute,
      second: timeMatches.groups.second,
    });
    matchGroup.date_time = dt.toISO();
  } catch (error) {
    await log("error", "NA", "NA", "convertDates-type_1", "FN CATCH", {
      error: error,
      failed_match: JSON.stringify(matchGroup),
    });
  }
}

async function type_2(matchGroup) {
  try {
    const timeMatches = getTime(matchGroup);
    const month = monthMap[matchGroup.month];
    const dt = DateTime.fromObject({
      day: matchGroup.day,
      month: month,
      year: matchGroup.year,
      hour: timeMatches.groups.hour,
      minute: timeMatches.groups.minute,
      second: timeMatches.groups.second,
    });
    matchGroup.date_time = dt.toISO();
  } catch (error) {
    await log("error", "NA", "NA", "convertDates-type_2", "FN CATCH", {
      error: error,
      failed_match: JSON.stringify(matchGroup),
    });
  }
}

async function type_3(matchGroup) {
  try {
    if (matchGroup.host_date === undefined) return;
    const timeMatches = getTime(matchGroup);

    const year = matchGroup.host_date.split("-")[0];
    const month = matchGroup.host_date.split("-")[1];
    const day = matchGroup.host_date.split("-")[2];

    const dt = DateTime.fromObject({
      day,
      month,
      year,
      hour: timeMatches.groups.hour,
      minute: timeMatches.groups.minute,
      second: timeMatches.groups.second,
    });
    matchGroup.date_time = dt.toISO();
  } catch (error) {
    await log("error", "NA", "NA", "convertDates-type_3", "FN CATCH", {
      error: error,
      failed_match: JSON.stringify(matchGroup),
    });
  }
}

async function type_4(matchGroup) {
  try {
    const dt = DateTime.fromObject({
      day: matchGroup.dy,
      month: matchGroup.mo,
      year: matchGroup.year,
      hour: matchGroup.hr,
      minute: matchGroup.mn,
      second: matchGroup.ss,
    });
    matchGroup.date_time = dt.toISO();
  } catch (error) {
    await log("error", "NA", "NA", "convertDates-type_4", "FN CATCH", {
      error: error,
      failed_match: JSON.stringify(matchGroup),
    });
  }
}

function getTime(matchGroup) {
  const timeRe = /(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})/;
  return matchGroup.host_time.match(timeRe);
}

async function convertDT(date) {
  let date1 = await DateTime.fromFormat(`${date}`, 'yyyy-MM-dd');
  let newDate = new Date(date1.toISO());
  return newDate;
}

module.exports = {convertDates, convertDT};
