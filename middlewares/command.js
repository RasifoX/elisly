const Discord = require("discord.js-light");

const applyFetch = require("../methods/applyFetch.js");
const cooldownMiddleware = require("./cooldown.js");
const settings = require("../settings.js");

module.exports = (async(client, db, message) => {
  if(!message.content.startsWith(settings.prefix)) return;

  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

  const c = message.content.slice(settings.prefix.length).split(" ")[0];
  const args = message.content.slice(settings.prefix.length).split(" ").slice(1);

  if(client.commands.has(c) || client.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = client.commands.has(c) ? client.commands.get(c) : client.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = client.commands.has(c) ? c : client.commands.findKey((commandData) => commandData.aliases.includes(c));

    userData.usedCommands += 1;
    await users.updateOne({id: message.author.id}, {$set: userData});

    try {
      const stoppedByCooldown = await cooldownMiddleware(client, db, message, command, commandName, args);

      if(!stoppedByCooldown) {
        await command.execute(client, db, await applyFetch(message, command.fetch), args);
      }
    } catch(error) {
      await message.reply(`botta bir hata oluştu, lütfen geliştiriciye ulaş: \`${error.toString()}\``);
      console.log(error);
    }
  }
});
