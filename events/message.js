const settings = require("../settings.js");

const levelingMiddleware = require("../middlewares/leveling.js");
const commandMiddleware = require("../middlewares/command.js");
const changeMessage = require("../methods/changeMessage.js");

module.exports = (async(client, db, message) => {
  if(message.channel.type !== "text" || message.author.bot) return;

  message = await changeMessage(message);

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
  const guildData = await guilds.findOne({id: message.guild.id});

  if(!guildData) {
    await guilds.insertOne({
      id: message.guild.id,
      levelRanks: {},
      moderatorRoles: [],
      logChannel: null,
      modlogChannel: null,
      twitchChannel: null,
      youtubeChannel: null,
      dliveChannel: null,
      wordGame: {
        channel: {
          id: null,
          updatedBy: null,
          updatedAt: null
        },
        award: {
          type: null,
          wordCount: null,
          award: null,
          updatedBy: null,
          updatedAt: null
        }
      },
      numberGameChannel: null
    });
  }

  await levelingMiddleware(client, db, message);
  await commandMiddleware(client, db, message);
});
