const Discord = require("discord.js-light");

module.exports = (async(message, args) => {
  const roles = new Discord.Collection();
  const users = new Discord.Collection();
  const channels = new Discord.Collection();
  const members = new Discord.Collection();

  for(let i = 0; i < args.length; i++) {
    const arg = args[i];

    if(arg.startsWith("<#")) {
      try {
        const channel = await message.guild.channels.fetch(arg.slice(2, -1), false);
        channels.set(channel.id, channel);
      } catch(err) {console.log(err)}
    } else if(arg.startsWith("<@&")) {
      try {
        const role = await message.guild.roles.fetch(arg.slice(3, -1), false);
        roles.set(role.id, role);
      } catch(err) {}
    } else if(arg.startsWith("<@!")) {
      try {
        const member = await message.guild.members.fetch(arg.slice(3, -1), false);
        const user = await message.client.users.fetch(arg.slice(3, -1), false);
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(arg.startsWith("<@")) {
      try {
        const member = await message.guild.members.fetch(arg.slice(2, -1), false);
        const user = await message.client.users.fetch(arg.slice(2, -1), false);
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(!isNaN(arg) && !arg.includes("+") && !arg.includes("-") && arg.length === 18) {
      try {
        const channel = await message.guild.channels.fetch(arg, false);
        channels.set(channel.id, channel);
      } catch(err) {}

      try {
        const role = await message.guild.roles.fetch(arg, false);
        roles.set(role.id, role);
      } catch(err) {}

      try {
        const member = await message.guild.members.fetch(arg, false);
        const user = await message.client.users.fetch(arg, false);
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    }
  }

  return {roles, users, channels, members};
});
