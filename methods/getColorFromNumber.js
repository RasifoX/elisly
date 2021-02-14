module.exports = ((colorNumber) => {
  return `#${(colorNumber >>> 0).toString(16).padStart(6, "0").toUpperCase()}`;
});
