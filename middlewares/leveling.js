const levelFormat = require("../methods/levelFormat.js");

module.exports = (async(client, db, message) => {
  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

  const oldLevel = levelFormat(userData.xp).level;

  const xp = Math.floor(Math.random() * 12);
  userData.xp += xp;

  const newLevel = levelFormat(userData.xp).level;

  await users.updateOne({id: message.author.id}, {$set: userData});

  if(newLevel > oldLevel) {
    await message.reply(`tebrikler artık **${newLevel}** seviyesiniz.`);
  }
});
