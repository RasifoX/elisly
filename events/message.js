const settings = require("../settings.js");

const levelingMiddleware = require("../middlewares/leveling.js");
const commandMiddleware = require("../middlewares/command.js");

module.exports = (async(client, db, message) => {
  if(message.channel.type !== "text" || message.author.bot) return;

  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

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

  const guilds = db.collection("guilds");
  const guildData = await db.collection("guilds").findOne({id: message.guild.id});

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
  await commandMiddleware(client, db, message);
});
