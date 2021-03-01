const elislycord = require("../packages/elislycord");
const levelFormat = require("../methods/levelFormat.js");

module.exports = (async(client, db, payload) => {
  const guilds = db.collection("guilds");
  const users = db.collection("users");
  const userData = await users.findOne({id: payload.author.id});
  const guildData = await guilds.findOne({id: payload.guild_id});

  if(!userData.xp.hasOwnProperty(payload.guild_id)) {
    userData.xp[payload.guild_id] = 0;
  }

  const oldLevel = levelFormat(userData.xp[payload.guild_id]).level;

  const xp = Math.floor(Math.random() * 12);
  userData.xp[payload.guild_id] += xp;

  const newLevel = levelFormat(userData.xp[payload.guild_id]).level;

  await users.updateOne({id: payload.author.id}, {$set: userData});

  if(newLevel > oldLevel) {
    if(Object.keys(guildData.levelRanks).includes(newLevel.toString())) {
      await message.reply(`tebrikler artık **${newLevel}** seviyesiniz, bu seviyeye özel olarak atanan ${message.guild.roles.cache.get(guildData.levelRanks[newLevel.toString()]).name} rolünü elde ettiniz.`);
    } else {
      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}>, tebrikler artık **${newLevel}** seviyesiniz.`
      });
    }
  }
});
