const fsp = require("node:fs").promises;
const fs = require("node:fs");
const readline = require("readline");
const pgPool = require("../../db/pg-pool");

const readFile = async () => {
  const re = /.*(?<file_path>\/opt.+SME\d+)/;
  const rl = readline.createInterface({
    input: fs.createReadStream("./Siemens_Files"),
    crlfDelay: Infinity,
  });

  let prev_sme = "";
  for await (const line of rl) {
    let matches = line.match(re);

    let current_sme = matches.groups.file_path.split("/")[5];

    if (current_sme === prev_sme) {
      continue;
    }

    prev_sme = current_sme;
    const queryStr = "SELECT modality FROM systems WHERE id = $1";
    const value = [current_sme];
    const system_data = await pgPool.query(queryStr, value);

    if (system_data.rows[0].modality === "MRI") {
      let update = "UPDATE systems" + "\n";
      let set_hhm = "SET hhm_config = ";
      let set_file = "hhm_file_config = ";
      let hhm_config =
        `'{"file_path": "${matches.groups.file_path}", "modality": "MRI", "windowsVersion": "win_10"}'` +
        "," +
        "\n";
      let where = `WHERE id = '${current_sme}';` + "\n" + "\n";

      let file_config =
        `'[{"query": "EvtApplication_Today", "file_name": "EvtApplication_Today.txt", "datetimeVersion": "type_3", "index": 0, "last_mod": ""}]'` +
        "\n";

      let string =
        update + set_hhm + hhm_config + set_file + file_config + where;

      await fsp.writeFile(`./configWriter/siemens/siemens_mri.sql`, string, {
        encoding: "utf-8",
        flag: "a",
      });

      let sme_str = `'${current_sme}', ` + "\n";

      await fsp.writeFile(`./configWriter/siemens/mri_systems.txt`, sme_str, {
        encoding: "utf-8",
        flag: "a",
      });
    }

    if (system_data.rows[0].modality === "CT") {
      let update = "UPDATE systems" + "\n";
      let set_hhm = "SET hhm_config = ";
      let set_file = "hhm_file_config = ";
      let hhm_config =
        `'{"file_path": "${matches.groups.file_path}", "modality": "CT", "windowsVersion": "win_10"}'` +
        "," +
        "\n";
      let where = `WHERE id = '${current_sme}';` + "\n" + "\n";

      let file_config =
        `'[{"query": "EvtApplication_Today", "file_name": "EvtApplication_Today.txt", "datetimeVersion": "type_3", "index": 0, "last_mod": ""}]'` +
        "\n";

      let string =
        update + set_hhm + hhm_config + set_file + file_config + where;

      await fsp.writeFile(`./configWriter/siemens/siemens_ct.sql`, string, {
        encoding: "utf-8",
        flag: "a",
      });

      let sme_str = `'${current_sme}', ` + "\n";

      await fsp.writeFile(`./configWriter/siemens/ct_systems.txt`, sme_str, {
        encoding: "utf-8",
        flag: "a",
      });
    }
  }
};

readFile();
