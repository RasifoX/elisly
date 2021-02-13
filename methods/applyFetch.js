const Discord = require("discord.js-light");
const caseChangerObject = require("./caseChangerObject.js");

module.exports = (async(message, fetchData = {}) => {
  const author = await message.client.users.fetch(message.author.id, false);

  let guild = message.guild;
  let owner, me;

  class Guild extends Discord.Guild {
    get me() {
      return me;
    }

    get owner() {
      return owner;
    }
  }

  class Message extends Discord.Message {
    constructor(client, msg, channel) {
      super(client, msg, channel);

      this.author = author;
    }

    get guild() {
      return guild;
    }
  }

  if(fetchData.me) {
    me = await guild.members.fetch(message.client.user.id, false);
  }

  if(fetchData.guild) {
    guild = await message.client.guilds.fetch(message.guild.id, false);
    owner = await guild.members.fetch(guild.ownerID, false);
  }

  guild = new Guild(message.client, caseChangerObject(guild.toJSON()));
  return new Message(message.client, caseChangerObject(message.toJSON()), message.channel);
});
