const groupsToArrayObj = (SME, matchGroups) => {
  let data = {};
  for (const [groupName, groupValue] of Object.entries(matchGroups)) {
    data[groupName] = groupValue;
  }
  data.system_id = SME;
  return data;
};

module.exports = groupsToArrayObj;
