("use strict");
require("dotenv").config({ path: "../.env" });
const { log } = require("../logger");
const execReadFileSize = require("../read/exec-readFileSize");
const initRedis = require(".");

async function updateRedisFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "updateRedisFileSize", "FN CALL");

    const redisClient = await initRedis();

    const newFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    const setKey = `${sme}.${file}`;
    const setValue = newFileSize.trim();
    await redisClient.set(setKey, setValue);
    await redisClient.quit();
    return;
  } catch (error) {
    await redisClient.quit();
    await log("error", "NA", sme, "updateRedisFileSize", "FN CALL", {
      error: error,
    });
  }
}

async function getRedisFileSize(sme, file) {
  try {
    await log("info", "NA", sme, "getRedisFileSize", "FN CALL");

    const redisClient = await initRedis();

    const getKey = `${sme}.${file}`;
    const fileSize = await redisClient.get(getKey);
    redisClient.quit();
    return fileSize;
  } catch (error) {
    await log("error", "NA", sme, "getRedisFileSize", "FN CALL", {
      error: error,
    });
    redisClient.quit();
  }
}

async function getCurrentFileSize(sme, exec_path, file_path, file) {
  try {
    await log("info", "NA", sme, "getCurrentFileSize", "FN CALL");

    const redisClient = await initRedis();

    const currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    redisClient.quit();
    return currentFileSize;
  } catch (error) {
    await log("error", "NA", sme, "getCurrentFileSize", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

async function passForProcessing(sme, array) {
  try {
    await log("info", "NA", sme, "passForProcessing", "FN CALL");

    const redisClient = await initRedis();

    const key = "dp:queue";
    for await (let datum of array) {
      await redisClient.sendCommand(["LPUSH", key, JSON.stringify(datum)]);
    }

    redisClient.quit();
  } catch (error) {
    await log("error", "NA", sme, "passForProcessing", "FN CALL", {
      error: error,
    });
    redisClient.quit();
  }
}

module.exports = {
  updateRedisFileSize,
  getCurrentFileSize,
  getRedisFileSize,
  passForProcessing,
};

// "{\"host_date\":\"12-Jan-23\",\"host_time\":\"01:08\",\"capture_datetime\":\"2023-01-12T08:15:00Z\",\"system_id\":\"SME09782\",\"pg_table\":\"mmb_ge_mm3\"}"
