const fs = require("node:fs");
const fsp = require("node:fs/promises");
const readline = require("node:readline");

async function read_file(file_path) {
  const file_data = (await fsp.readFile(file_path)).toString();
  return file_data;
}

async function extract_sme(file_path) {
  const sme_re = /SME\d{5}/g;
  const file_data = await read_file(file_path);
  const sme_matches = file_data.match(sme_re);
  const unique_sme = [...new Set(sme_matches)];
  console.log(unique_sme);
}

extract_sme("./GE_Imaging");
