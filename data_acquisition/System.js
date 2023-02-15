class System {
  constructor(sysConfigData, fileToParse, jobId) {
    (this.sysConfigData = sysConfigData),
      (this.fileToParse = fileToParse),
      (this.jobId = jobId);
    this.sme = this.sysConfigData.id;
    this.complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;
    this.parsers = fileToParse.parsers;
  }
}

module.exports = System;
