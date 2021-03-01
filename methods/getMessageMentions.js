const elislycord = require("../packages/elislycord");

module.exports = (async(payload, args) => {
  const roles = elislycord.createStore();
  const users = elislycord.createStore();
  const channels = elislycord.createStore();
  const members = elislycord.createStore();

  for(let i = 0; i < args.length; i++) {
    const arg = args[i];

    if(arg.startsWith("<#")) {
      try {
        const channel = await elislycord.request("GET", elislycord.routes.channel(arg.slice(2, -1)));
        channels.set(channel.id, channel);
      } catch(err) {}
    } else if(arg.startsWith("<@&")) {
      try {
        const role = await message.guild.roles.fetch(arg.slice(3, -1), false);
        roles.set(role.id, role);
      } catch(err) {}
    } else if(arg.startsWith("<@!")) {
      try {
        const member = {id: 0};
        const user = await elislycord.request("GET", elislycord.routes.user(arg.slice(3, -1)))
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(arg.startsWith("<@")) {
      try {
        const member = {id: 0};
        const user = await elislycord.request("GET", elislycord.routes.user(arg.slice(3, -1)));
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(!isNaN(arg) && !arg.includes("+") && !arg.includes("-") && arg.length === 18) {
      try {
        const channel = await elislycord.request("GET", elislycord.routes.channel(arg));
        channels.set(channel.id, channel);
      } catch(err) {}

      try {
        const role = await message.guild.roles.fetch(arg, false);
        roles.set(role.id, role);
      } catch(err) {}

      try {
        const member = {id: 0};
        const user = await elislycord.request("GET", elislycord.routes.user(arg));
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    }
  }

  return {roles, users, channels, members};
});
