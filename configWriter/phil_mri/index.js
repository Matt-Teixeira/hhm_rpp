const fsp = require("node:fs").promises;
const fs = require("node:fs");
const readline = require("readline");

const readFile = async () => {
  const re = /.*(?<file_path>\/opt.+SME\d+)/;
  const rl = readline.createInterface({
    input: fs.createReadStream("./Philips_MRI"),
    crlfDelay: Infinity,
  });

  let prev_sme = ""
  for await (const line of rl) {
    let matches = line.match(re);

    let current_sme = matches.groups.file_path.split("/")[5];
    
    if (current_sme === prev_sme) {
        continue;
    }

    prev_sme = current_sme;
    console.log(current_sme)
    

    let update = "UPDATE systems" + "\n";
    let set = "SET hhm_config = ";
    let hhm_config =
      `'{"file_path": "${matches.groups.file_path}", "file_types": [{"file": "rmmu_long_", "datetimeVersion": "type_4", "regEx": "rmmu_long_cryogenic[0-9]"}, {"file": "rmmu_short_", "datetimeVersion": "type_4", "regEx": "rmmu_short_cryogenic[0-9]"}, {"file": "rmmu_magnet", "datetimeVersion": "type_4", "regEx": "rmmu_magnet[0-9]"}, {"file": "logcurrent", "datetimeVersion": "type_3", "regEx": "logcurrent"}], "modality": "MRI"}'` +
      "\n";
    let where = `WHERE id = '${current_sme}';` + "\n";

    let string = update + set + hhm_config + where + "\n";

    await fsp.writeFile(`./configWriter/phil_mri/phil_mri.sql`, string, {
      encoding: "utf-8",
      flag: "a",
    });

    let sme_str = `'${current_sme}', ` + "\n";

    await fsp.writeFile(`./configWriter/phil_mri/systems.txt`, sme_str, {
      encoding: "utf-8",
      flag: "a",
    });
  }
};

readFile();
