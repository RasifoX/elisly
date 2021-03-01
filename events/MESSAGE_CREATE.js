const elislycord = require("../packages/elislycord");

const settings = require("../settings.js");

const levelingMiddleware = require("../middlewares/leveling.js");
const commandMiddleware = require("../middlewares/command.js");

module.exports = (async(client, db, payload) => {
  const channel = await elislycord.request("GET", elislycord.routes.channel(payload.channel_id));
  if(channel.type !== 0 || !payload.author || payload.author.bot) return;

  const users = db.collection("users");
  const userData = await users.findOne({id: payload.author.id});

  if(!userData) {
    await users.insertOne({
      "id": payload.author.id,
      "xp": {},
      "badges": [],
      "usedCommands": 0,
      "messagesCount": {},
      "cooldowns": {}
    });
  }

  const guilds = db.collection("guilds");
  const guildData = await guilds.findOne({id: payload.guild_id});

  if(!guildData) {
    await guilds.insertOne({
      "id": message.guild.id,
      "levelRanks": {},
      "moderatorRoles": [],
      "logChannel": null,
      "modlogChannel": null,
      "twitchChannel": null,
      "youtubeChannel": null,
      "dliveChannel": null,
      "wordGame": {
        "channel": {
          "id": null,
          "updatedBy": null,
          "updatedAt": null
        },
        "award": {
          "type": null,
          "wordCount": null,
          "award": null,
          "updatedBy": null,
          "updatedAt": null
        }
      },
      numberGameChannel: null
    });
  }

  await levelingMiddleware(client, db, payload);
  await commandMiddleware(client, db, payload);
});
