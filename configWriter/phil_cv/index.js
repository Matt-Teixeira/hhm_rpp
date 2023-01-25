const fsp = require("node:fs").promises;
const fs = require("node:fs");
const readline = require("readline");

const readFile = async () => {
  const re = /.*(?<file_path>\/opt.+SME\d+)/;
  const rl = readline.createInterface({
    input: fs.createReadStream("./Philips_Cath"),
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

    let update = "UPDATE systems" + "\n";
    let set_hhm = "SET hhm_config = ";
    let set_file = "hhm_file_config = ";
    let hhm_config =
      `'{"file_path": "${matches.groups.file_path}", "modality": "CV"}'` +
      "," +
      "\n";
    let where = `WHERE id = '${current_sme}';` + "\n" + "\n";

    let file_config =
      `'[{"query": "EventLog", "file_name": "EventLog.txe", "datetimeVersion": "type_3", "index": 0, "last_mod": ""}]'` +
      "\n";

    let string = update + set_hhm + hhm_config + set_file + file_config + where;

    await fsp.writeFile(`./configWriter/phil_cv/phil_cv.sql`, string, {
      encoding: "utf-8",
      flag: "a",
    });

    let sme_str = `'${current_sme}', ` + "\n";

    await fsp.writeFile(`./configWriter/phil_cv/systems.txt`, sme_str, {
      encoding: "utf-8",
      flag: "a",
    });
  }
};

readFile();
