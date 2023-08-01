/* require("dotenv").config();
const fs = require("fs");
const { Pool } = require("pg");
const pgPool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PW,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  port: process.env.PG_PORT,
  sslMode: require,
  //max: 20, // set pool max size to 20
  //idleTimeoutMillis: 30000, // close idle clients after 1 second
  //connectionTimeoutMillis: 25000, // return an error after 1 second if connection could not
  ssl: {
    cert: fs.readFileSync(`./db/BaltimoreCyberTrustRoot.crt.pem`),
    rejectUnauthorized: true,
  },
  // idleTimeoutMillis: 60000, // DOESN'T SEEM TO MATTER
});

module.exports = pgPool;
 */

/* const fs = require('fs');
const pgp = require('pg-promise')();

const config = {
   host: process.env.PG_HOST,
   port: process.env.PG_PORT,
   database: process.env.PG_DB,
   user: process.env.PG_USER,
   password: process.env.PG_PW,
   ssl: {
      require: true,
      cert: fs.readFileSync(`./db/BaltimoreCyberTrustRoot.crt.pem`),
      rejectUnauthorized: true,
   },
};

const db = pgp(config);

module.exports = db; */