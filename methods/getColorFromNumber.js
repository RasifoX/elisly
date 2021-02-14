module.exports = ((colorNumber) => {
  return `#${(settings.color >>> 0).toString(16).padStart(6, "0").toUpperCase()}`;
});
