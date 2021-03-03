const createStore = require("./createStore.js");
const request = require("../request.js");
const routes = require("../routes.js");

module.exports = (async(payload, args) => {
  const roles = createStore();
  const users = createStore();
  const channels = createStore();
  const members = createStore();

  for(let i = 0; i < args.length; i++) {
    const arg = args[i];

    if(arg.startsWith("<#")) {
      try {
        const channel = await request("GET", routes.channel(arg.slice(2, -1)));
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
        const user = await request("GET", routes.user(arg.slice(3, -1)))
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(arg.startsWith("<@")) {
      try {
        const member = {id: 0};
        const user = await request("GET", routes.user(arg.slice(3, -1)));
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    } else if(!isNaN(arg) && !arg.includes("+") && !arg.includes("-") && arg.length === 18) {
      try {
        const channel = await request("GET", routes.channel(arg));
        channels.set(channel.id, channel);
      } catch(err) {}

      try {
        const role = await message.guild.roles.fetch(arg, false);
        roles.set(role.id, role);
      } catch(err) {}

      try {
        const member = {id: 0};
        const user = await request("GET", routes.user(arg));
        members.set(member.id, member);
        users.set(user.id, user);
      } catch(err) {}
    }
  }

  return {roles, users, channels, members};
});
