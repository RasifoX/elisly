module.exports = ((snowflake) => {
  return (Math.floor(snowflake / 4194304) + 1420070400000);
});
