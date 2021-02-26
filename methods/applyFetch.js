const Discord = require("discord.js-light");
const caseChangerObject = require("./caseChangerObject.js");

module.exports = (async(message, fetchData = [], permissionsData = []) => {
  const author = await message.client.users.fetch(message.author.id, false);
  let guildIsFetched = false;

  let guild = message.guild;
  let owner, me, member;

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

    get member() {
      return member;
    }
  }

  if(fetchData.includes("me")) {
    me = await guild.members.fetch(message.client.user.id, false);
  }

  if(fetchData.includes("guild")) {
    guild = await message.client.guilds.fetch(message.guild.id, false);
    guıldIsFetched = true;
  }

  if(fetchData.includes("guild") || permissionsData.includes("GUILD_OWNER")) {
    if(!guildIsFetched) {
      guild = await message.client.guilds.fetch(message.guild.id, false);
      guıldIsFetched = true;
    }

    owner = await guild.members.fetch(guild.ownerID, false);
  }

  if(fetchData.includes("member") || permissionsData.some((permission) => !(["BOT_OWNER", "GUILD_OWNER"]).includes(permission))) {
    if(!guildIsFetched) {
      guild = await message.client.guilds.fetch(message.guild.id, false);
      guıldIsFetched = true;
    }

    member = await guild.members.fetch(message.author.id, false);
  }

  guild = new Guild(message.client, caseChangerObject(guild.toJSON()));

  return new Message(message.client, caseChangerObject(message.toJSON()), message.channel);
});
