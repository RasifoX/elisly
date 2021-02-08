module.exports = ((totalXp) => {
  const base = 100;
  const realXp = (totalXp + 0);
  let level = 0;
  let xp = 0;

  for(let i = 0; i < Infinity; i++) {
    const needXp = (level + 1) * base;

    if(totalXp > needXp) {
      level += 1;
      totalXp -= needXp;
    } else {
      break;
    }
  }

  return ({
    xp: totalXp,
    level,
    totalXp: realXp,
    needLevel: ((level + 1) * base)
  });
});
