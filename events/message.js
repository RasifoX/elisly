const settings = require("../settings.js");

const cooldownMiddleware = require("../middlewares/cooldown.js");
const levelingMiddleware = require("../middlewares/leveling.js");

module.exports = (async(client, db, message) => {
  if(message.channel.type !== "text" || message.author.bot) return;

  const users = db.collection("users");
  let userData = await users.findOne({id: message.author.id});

  if(!userData) {
    await users.insertOne({
      id: message.author.id,
      xp: {},
      badges: [],
      usedCommands: 0,
      messagesCount: {},
      cooldowns: {}
    });
  }

  userData = await users.findOne({id: message.author.id});

  const guilds = db.collection("guilds");
  const guildData = await users.findOne({id: message.guild.id});

  if(!guildData) {
    await guilds.insertOne({
      id: message.guild.id,
      levelRanks: {},
      moderatorRoles: [],
      logChannel: "",
      modlogChannel: "",
      twitchChannel: "",
      youtubeChannel: "",
      dliveChannel: ""
    });
  }

  await levelingMiddleware(client, db, message);

  const c = message.content.slice(settings.prefix.length).split(" ")[0];
  const args = message.content.slice(settings.prefix.length).split(" ").slice(1);

  if(client.commands.has(c) || client.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = client.commands.has(c) ? client.commands.get(c) : client.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = client.commands.has(c) ? c : client.commands.findKey((commandData) => commandData.aliases.includes(c));

    userData.usedCommands += 1;
    await users.updateOne({id: message.author.id}, {$set: userData});

    try {
      await cooldownMiddleware(client, db, message, command, commandName, args);
    } catch(error) {
      await message.reply(`botta bir hata oluştu, lütfen geliştiriciye ulaş: ${error.toString()}`);
      console.log(error);
    }
  }
});
