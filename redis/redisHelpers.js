const { log } = require("../logger");
const execReadFileSize = require("../read/exec-readFileSize");
const initRedis = require(".");

async function updateRedisFileSize(sme, exec_path, file_path, file) {
  const redisClient = await initRedis();
  try {
    await log("info", "NA", sme, "updateRedisFileSize", "FN CALL");

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

    let fileSize = await redisClient.get(getKey);
    // if key does not exitst in redis, null will be returned, otherwise a string will be returned.
    if (typeof fileSize === "string") fileSize = parseInt(fileSize);
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

    let currentFileSize = await execReadFileSize(
      exec_path,
      `${file_path}/${file}`
    );
    redisClient.quit();

    // If file does not exist in dir, stdout returns new line character '\n'. Set size to null
    if (currentFileSize === "\n") {
      await log("warn", "NA", sme, "getCurrentFileSize", "FN CALL", {
        message: "File not found in dir",
      });
      currentFileSize = null;
      return currentFileSize;
    }

    currentFileSize = parseInt(currentFileSize);
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

async function getRedisLinePositions(sme, file) {
  const redisClient = await initRedis();
  try {
    const key = `${sme}.${file}`;
    let line = await redisClient.get(key);
    await redisClient.quit();
    if (line === null) {
      await log("warn", "NA", sme, "getRedisLinePositions", "FN CALL", {
        message: "Redis returned null. This may be a new system.",
      });
      return {
        eal: null,
        events: null,
      };
    }

    line = JSON.parse(line);
    return line;
  } catch (error) {
    await log("error", "NA", sme, "getRedisLinePositions", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

async function updateRedisLinePositions(sme, file, eal, events) {
  const redisClient = await initRedis();
  try {
    let testData = {
      eal,
      events,
    };

    testData = JSON.stringify(testData);

    const setKey = `${sme}.${file}`;
    await redisClient.set(setKey, testData);
    await redisClient.quit();
    return;
  } catch (error) {
    await log("error", "NA", sme, "updateRedisLinePositions", "FN CALL", {
      error: error,
    });
    await redisClient.quit();
  }
}

module.exports = {
  updateRedisFileSize,
  getCurrentFileSize,
  getRedisFileSize,
  passForProcessing,
  updateRedisLine,
  getRedisLine,
  updateRedisLinePositions,
  getRedisLinePositions,
};

("I       2023-01-26      11:14:43        CT_PRF  4       Free Resources: DB: Local 2827 MB Exchangeboard 758 MB PixelPartition[store]: 86612 MB PixelPartition[scan]: 88745 MB PixelPartition[stamp]: 121064 MB IPT partition: 25675 MB phys MEM: 4095 MB");

// "{\"host_date\":\"12-Jan-23\",\"host_time\":\"01:08\",\"capture_datetime\":\"2023-01-12T08:15:00Z\",\"system_id\":\"SME09782\",\"pg_table\":\"mmb_ge_mm3\"}"
