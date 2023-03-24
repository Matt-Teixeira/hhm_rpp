const exec_move = require("./exec-move");
const fsp = require("node:fs").promises;

const dirs = [
  "/opt/hhm-files/C0051/SHIP003/SME00445/archive",
  "/opt/hhm-files/C0051/SHIP003/SME00446/archive",
  "/opt/hhm-files/C0051/SHIP054/SME00782/archive",
  "/opt/hhm-files/C0051/SHIP054/SME00785/archive",
  "/opt/hhm-files/C0051/SHIP054/SME00786/archive",
  "/opt/hhm-files/C0051/SHIP054/SME01227/archive",
  "/opt/hhm-files/C0051/SHIP054/SME02548/archive",
  "/opt/hhm-files/C0051/SHIP061/SME02535/archive",
  "/opt/hhm-files/C0051/SHIP090/SME02552/archive",
  "/opt/hhm-files/C0051/SHIP090/SME07852/archive",
  "/opt/hhm-files/C0051/SHIP090/SME07855/archive",
  "/opt/hhm-files/C0051/SHIP090/SME07860/archive",
  "/opt/hhm-files/C0051/SHIP090/SME07862/archive",
  "/opt/hhm-files/C0051/SHIP090/SME08102/archive",
  "/opt/hhm-files/C0051/SHIP129/SME11259/archive",
  "/opt/hhm-files/C0051/SHIP129/SME11532/archive",
  "/opt/hhm-files/C0051/SHIP129/SME11925/archive",
  "/opt/hhm-files/C0051/SHIP129/SME11927/archive",
  "/opt/hhm-files/C0137/SHIP005/SME00886/archive",
  "/opt/hhm-files/C0137/SHIP005/SME00888/archive",
  "/opt/hhm-files/C0137/SHIP005/SME00892/archive",
  "/opt/hhm-files/C099962/MAIN/SME11722/archive",
];

const move_path_sh = "./move.sh";

const move_from_archive = async (paths) => {
  for (const path of paths) {
    const files_in_dir = await fsp.readdir(`${path}`);

    const complete_path = `${path}/${files_in_dir[0]}`;

    const new_path = path.replace("/archive", "");
    let str = `mv ${complete_path} ${new_path}/EventLog.txe`;
    console.log(str);
    await exec_move(move_path_sh, [str]);
  }
};

move_from_archive(dirs);
