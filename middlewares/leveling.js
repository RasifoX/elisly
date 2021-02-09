const levelFormat = require("../methods/levelFormat.js");

module.exports = (async(client, db, message) => {
  const guilds = db.collection("guilds");
  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});
  const guildData = await guilds.findOne({id: message.guild.id});

  const oldLevel = levelFormat(userData.xp).level;

  const xp = Math.floor(Math.random() * 12);
  userData.xp += xp;

  const newLevel = levelFormat(userData.xp).level;

  await users.updateOne({id: message.author.id}, {$set: userData});

  if(newLevel > oldLevel) {
    if(Object.keys(guilData.levelRanks).includes(newLevel.toString())) {
      await message.reply(`tebrikler artık **${newLevel}** seviyesiniz, bu seviyeye özel olarak atanan ${message.guild.roles.cache.get(guildData.levelRanks[newLevel.toString()]).name} rolünü elde ettiniz.`);
    } else {
      await message.reply(`tebrikler artık **${newLevel}** seviyesiniz.`);
    }
  }
});
