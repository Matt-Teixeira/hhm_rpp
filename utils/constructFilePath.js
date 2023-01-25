const fs = require("node:fs");

async function constructFilePath(filePath, fileToParse, reExString) {
  const re = new RegExp(`${reExString}`);
  const dailyFileDir = await fs.promises.readdir(filePath);
  let latestDailyDir;

  //console.log(dailyFileDir);
  //console.log(re);

  for (let i = dailyFileDir.length - 1; i > 0; i--) {
  
    let match = re.test(dailyFileDir[i]);
    if (match) {
      latestDailyDir = dailyFileDir[i];
      break;
    }
  }
  //console.log(latestDailyDir);
  
  let completeFilePath;
/* 
  // If equal, latestDailyDir is not a directory, but the file to parse
  if (latestDailyDir === fileToParse) {
    completeFilePath = `${filePath}/${fileToParse}`;
    return completeFilePath;
  }

  completeFilePath = `${filePath}/${latestDailyDir}/${fileToParse}`;
  return completeFilePath; 
  */

  completeFilePath = `${filePath}/${latestDailyDir}`;
    return completeFilePath;
}

module.exports = constructFilePath;
