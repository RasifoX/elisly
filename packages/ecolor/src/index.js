module.exports.getColorFromNumber = ((colorNumber) => {
  return `#${(colorNumber >>> 0).toString(16).padStart(6, "0").toUpperCase()}`;
});

module.exports.rgbToHex = ((r, g, b) => {
  const componentToHex = ((c) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  });

  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
});

module.exports.hexToRgb = ((hex) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
});
