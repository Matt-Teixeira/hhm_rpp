const [
  addLogEvent,
  writeLogEvents,
  dbInsertLogEvents,
  makeAppRunLog,
] = require("../utils/logger/log");
const {
  type: { I, W, E },
  tag: { cal, det, cat, seq, qaf },
} = require("../utils/logger/enums");

class System {
  constructor(sysConfigData, fileToParse, job_id, run_log) {
    (this.sysConfigData = sysConfigData),
      (this.fileToParse = fileToParse),
      (this.job_id = job_id),
      (this.run_log = run_log);
    this.sme = this.sysConfigData.id;
    this.complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;
    this.parsers = fileToParse.parsers;
    this.I = I;
    this.W = W;
    this.E = E;
    this.cal = cal;
    this.det = det;
    this.cat = cat;
    this.seq = seq;
    this.qaf = qaf;
  }

  static async addLogEvent(
    type,
    run_log,
    name,
    tag,
    note = null,
    error = null
  ) {
    await addLogEvent(type, run_log, name, tag, note, error);
  }
}

module.exports = System;
