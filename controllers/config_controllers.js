const pgPool = require("../db/pg-pool");

const get_all_configs = async (res, req, next) => {
  res.send("All Routes!");
};

module.exports = { get_all_configs };
