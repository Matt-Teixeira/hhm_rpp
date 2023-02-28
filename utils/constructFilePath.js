const fs = require("node:fs");

async function base_file_path(system_config) {
  const base_path = "/opt/hhm-files";
  const path = `${base_path}/${system_config.customer_id}/${system_config.site_id}/${system_config.id}`;
  system_config.hhm_config.base_path = path;
  return system_config;
}

module.exports = base_file_path;
