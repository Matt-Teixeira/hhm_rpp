("use strict");
require("dotenv").config({ path: "../../.env" });
const { log } = require("../../../logger");
const fs = require("node:fs");
const readline = require("readline");
const { philips_re } = require("../../../parse/parsers");
const groupsToArrayObj = require("../../../parse/prep-groups-for-array");
const mapDataToSchema = require("../../../persist/map-data-to-schema");
const { philips_cv_eventlog_schema } = require("../../../persist/pg-schemas");
const bulkInsert = require("../../../persist/queryBuilder");
const { blankLineTest } = require("../../../utils/regExHelpers");
const {
  getCurrentFileSize,
  getRedisFileSize,
  updateRedisFileSize,
} = require("../../../redis/redisHelpers");
const execHead = require("../../../read/exec-head");
const generateDateTime = require("../../../processing/date_processing/generateDateTimes");

// EventLog.txt runs 1 per day

async function phil_cv_eventlog(jobId, sysConfigData, fileToParse) {
  const sme = sysConfigData.id;

  const updateSizePath = "./read/sh/readFileSize.sh";
  const fileSizePath = "./read/sh/readFileSize.sh";
  const headPath = "./read/sh/head.sh";

  const data = [];

  try {
    const complete_file_path = `${sysConfigData.hhm_config.file_path}/${fileToParse.file_name}`;

    await log("info", jobId, sme, "phil_cv_eventlog", "FN CALL", {
      file: complete_file_path,
    });

    const prevFileSize = await getRedisFileSize(sme, fileToParse.file_name);
    console.log("Redis File Size: " + prevFileSize);

    let rl;
    if (prevFileSize === null) {
      console.log("This needs to be read from file");
      rl = readline.createInterface({
        input: fs.createReadStream(complete_file_path),
        crlfDelay: Infinity,
      });
    }

    if (prevFileSize > 0 && prevFileSize !== null) {
      console.log("File Size prev saved in Redis");

      const currentFileSize = await getCurrentFileSize(
        sme,
        fileSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
      console.log("CURRENT FILE SIZE: " + currentFileSize);

      const delta = currentFileSize - prevFileSize;
      await log("info", jobId, sme, "delta", "FN CALL", { delta: delta });
      console.log("DELTA: " + delta);

      if (delta === 0) {
        await log("warn", jobId, sme, "delta-0", "FN CALL");
        return;
      }

      let tailDelta = await execHead(headPath, delta, complete_file_path);

      rl = tailDelta.toString().split(/(?:\r\n|\r|\n)/g);
    }

    for await (const line of rl) {
      let matches = line.match(philips_re.cv.eventlog);
      if (matches === null) {
        const isNewLine = blankLineTest(line);
        if (isNewLine) {
          continue;
        } else {
          await log("error", jobId, sme, "Not_New_Line", "FN CALL", {
            message: "This is not a blank new line - Bad Match",
            line,
          });
        }
      } else {
        matches.groups.system_id = sme;

        const dtObject = await generateDateTime(
          jobId,
          matches.groups.system_id,
          fileToParse.pg_table,
          matches.groups.host_date,
          matches.groups.host_time
        );

        if (dtObject === null) {
          await log("warn", jobId, sme, "date_time", "FN CALL", {
            message: "date_time object null",
          });
        }

        matches.groups.host_datetime = dtObject;

        data.push(matches.groups);
      }
    }

    // homogenize data to prep for insert to db
    const mappedData = mapDataToSchema(data, philips_cv_eventlog_schema);
    const dataToArray = mappedData.map(({ ...rest }) => Object.values(rest));

    const insertSuccess = await bulkInsert(
      jobId,
      dataToArray,
      sysConfigData,
      fileToParse
    );
    if (insertSuccess) {
      await updateRedisFileSize(
        sme,
        updateSizePath,
        sysConfigData.hhm_config.file_path,
        fileToParse.file_name
      );
    }
  } catch (error) {
    await log("error", jobId, sme, "phil_cv_eventlog", "FN CALL", {
      sme: sme,
      error: error.message,
      file: fileToParse,
    });
  }
}

module.exports = phil_cv_eventlog;

/* XDDS�2022-03-02�08:40:26�Information�20481�TechnicalEventID: 840000104 �Description: XDDS discovered a new device �Channel Identification: X-Ray Channel Undefined �Module: XDDS �Source file: .\XDDSDeviceFinder.cpp �Line Number: 990 �Memo: DHCP server file: C:\Program files\DHCPServer\dhcpsrv.ini is already up to date for device: ID IP address: 172.22.1.6 MAC address: 00:E0:4B:49:88:D7 providing 1 services: XDDSServiceTypeImageDetectionLateral
CAHost�2022-03-02�08:40:40�Information�200�TechnicalEventID: 220200 �Description: Client status changed �Channel Identification: X-Ray Channel Undefined �Module: CAHost �Source file: t:\houston_cos_inc2_ec_build_1211834\uos\os\configassist\src\cahost\computer.cpp �Line Number: 402 �Memo: Status of GEOIPC changed to Running
Archiving & Networking�2022-03-01�20:10:35�Information�20481�Technical Event ID:   570000024�Description: Archiving configuration data�Channel Identification: X-Ray Channel Undefined�Module: C:\Program Files\PMS\Fusion\Ar_archnetwork_prod\ArArchNetworkServer_ur.exe�Source File: .\ArConfigurationAdapter.cpp�Line Number: 2284�Memo: [SERVICE_SENDER]  Archiving & Networking [SERVICE_RECEIVER]  Archiving & Networking [MESSAGE NAME]  TEMPLATE_TYPE:  �SubsystemNumber: 0�ThreadName: 9024 */
// (?<category>.+?)\S(?<host_date>\d{4}-\d{2}-\d{2})\S(?<host_time>\d{1,2}:\d{1,2}:\d{1,2})\S(?<error_type>\w+)\S(?<num>\d+)�?(?=Technical)((Technical Event ID:\s+|TechnicalEventID:)(?<technical_event_id>.+?)�)?(?:Description: (?<Description>.+?)�)?(?:Channel Identification: (?<ChannelID>.+?)�)?(?:Module: (?<Module>.+?)�)?((Source File: |Source file: )(?<Source>.+?)�)?(?:Line Number: (?<Line>.+?)�)(?:(Memo: |Memo:)(?<Memo>.+)�?)�?((?:SubsystemNumber: (?<sub>).?)�)?
