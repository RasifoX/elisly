module.exports = ((data, joinString, maxCount) => {
  if(data.length > maxCount) {
    return `${data.slice(0, maxCount).join(joinString)} +${data.length - maxCount} daha`;
  } else {
    return data.join(joinString);
  }
});
