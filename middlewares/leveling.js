const levelFormat = require("../methods/levelFormat.js");

module.exports = (async(client, db, message) => {
  const guilds = db.collection("guilds");
  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});
  const guildData = await guilds.findOne({id: message.guild.id});

  if(!userData.xp.hasOwnProperty(message.guild.id)) {
    userData.xp[message.guild.id] = 0;
  }

  const oldLevel = levelFormat(userData.xp[message.guild.id]).level;

  const xp = Math.floor(Math.random() * 12);
  userData.xp[message.guild.id] += xp;

  const newLevel = levelFormat(userData.xp[message.guild.id]).level;

  await users.updateOne({id: message.author.id}, {$set: userData});

  if(newLevel > oldLevel) {
    if(Object.keys(guildData.levelRanks).includes(newLevel.toString())) {
      await message.reply(`tebrikler artık **${newLevel}** seviyesiniz, bu seviyeye özel olarak atanan ${message.guild.roles.cache.get(guildData.levelRanks[newLevel.toString()]).name} rolünü elde ettiniz.`);
    } else {
      await message.reply(`tebrikler artık **${newLevel}** seviyesiniz.`);
    }
  }
});
