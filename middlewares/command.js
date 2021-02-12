const Discord = require("discord.js");
const settings = require("../settings.js");
const cooldownMiddleware = require("./cooldown.js");

module.exports = (async(client, db, message) => {
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
      await cooldownMiddleware(client, db, message, command, commandName, args);

      if(command.fetchGuild) {
        const guild = await client.guilds.fetch(message.guild.id, false);

        await command.execute(client, db, message, guild, args);
      } else {
        await command.execute(client, db, message, null, args);
      }
    } catch(error) {
      await message.reply(`botta bir hata oluştu, lütfen geliştiriciye ulaş: \`${error.toString()}\``);
      console.log(error);
    }
  }
});
