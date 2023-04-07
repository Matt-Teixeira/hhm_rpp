const { log } = require("../logger");
const initRedis = require(".");

async function getRedisLine(sme, file) {
  const redisClient = await initRedis();
  try {
    const key = `${sme}.${file}`;
    let line = await redisClient.get(key);
    await redisClient.quit();
    if (line === null) {
      await log("warn", "NA", sme, "getRedisLine", "FN CALL", {
        message: "Redis returned null. This may be a new system.",
      });
    }
    return line;
  } catch (error) {
    await log("error", "NA", sme, "getRedisLine", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

async function updateRedisLine(sme, file, first_line) {
  const redisClient = await initRedis();
  try {
    const setKey = `${sme}.${file}`;
    await redisClient.set(setKey, first_line);
    await redisClient.quit();
    return;
  } catch (error) {
    await log("error", "NA", sme, "updateRedisLine", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

async function update_redis_last_file(sme, file) {
  const redisClient = await initRedis();
  try {
    const setKey = `${sme}.last_rmmu_file`;
    await redisClient.set(setKey, file);
    await redisClient.quit();
    return;
  } catch (error) {
    await log("error", "NA", sme, "update_redis_last_file", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

async function get_last_cached_file(sme) {
  const redisClient = await initRedis();
  try {
    const key = `${sme}.last_rmmu_file`;
    let line = await redisClient.get(key);
    await redisClient.quit();
    return line;
  } catch (error) {
    await log("error", "NA", sme, "get_last_cached_file", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

module.exports = { getRedisLine, updateRedisLine, update_redis_last_file, get_last_cached_file };
