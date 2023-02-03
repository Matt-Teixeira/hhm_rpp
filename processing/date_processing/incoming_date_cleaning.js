function remove__(time) {
  let replaced = time.replace(/__\d+/, "");
  return replaced;
}

module.exports = {remove__}