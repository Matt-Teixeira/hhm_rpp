const exec_move = require("./exec-move");
const fsp = require("node:fs").promises;

const move_path_sh = "./move.sh";

const rmmu = {
  main_dir: "/opt/hhm-files/C0137/SHIP013/SME01138",
  short: {
    re: /rmmu_short_cryogenic20\d+\.log/,
    dir: "rmmu_short",
  },
  long: {
    re: /rmmu_long_cryogenic20\d+\.log/,
    dir: "rmmu_long",
  },
  magnet: {
    re: /rmmu_magnet20\d+\.log/,
    dir: "rmmu_magnet",
  },
};

async function run_job(dir, rmmu_dir) {
  const files_in_dir = await fsp.readdir(`${dir}`);

  for await (const file of files_in_dir) {
    const file_match = file.match(rmmu_dir.re);

    try {
      if (file_match) {
        //console.log(file_match[0]);
        let rmmu_file = file_match[0];
        let str = `mv ${dir}/${rmmu_file} ${dir}/${rmmu_dir.dir}`
        console.log(str);
        await exec_move(move_path_sh, [str]); //[dir, rmmu_file, rmmu_dir.dir]
      }
    } catch (error) {
      console.log(error);
    }
  }

console.log("Complete")
}

run_job(rmmu.main_dir, rmmu.magnet);
