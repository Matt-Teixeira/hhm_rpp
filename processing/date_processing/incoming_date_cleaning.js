function remove__(time) {
  let replaced = time.replace(/__\d+/, "");
  return replaced.trim();
}

module.exports = { remove__ };
