const settings = require("../settings.js");

module.exports = (async(client, db, message) => {
  if(!message.channel.type !== "text") return;

  const xp = Math.floor(Math.random() * 12);
  const users = db.collections("users");

  let userData;
  userData = await users.findOne({id: message.author.id});

  if(!userData) {
    await users.insertOne({
      id: message.author.id,
      xp: 0,
      badges: [],
      usedCommands: 0,
      messagesCount: {},
      cooldowns: {}
    });
  }

  userData = await users.findOne({id: message.author.id});
  userData.xp += xp;

  await userData.save();

  const c = message.content.slice(settings.prefix).split(" ")[0];
  const args = message.content.slice(settings.prefix).split(" ").slice(1);

  if(client.commands.has(c) || client.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = client.commands.has(c) ? client.commands.get(c) : client.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = client.commands.has(c) ? c : client.commands.findKey((commandData) => commandData.aliases.includes(c));

    if(userData.cooldowns.hasOwnProperty(commandName)) {
      await message.reply(`bu komutu kullanmak için **${userData.cooldowns[commandName].toFixed(2)}** saniye beklemelisin.`)
    } else {
      userData.usedCommand += 1;
      await userData.save();

      try {
        await command.execute(client, db, message, args);

        if(command.cooldown) {
          userData.cooldowns[commandName] = ({
            usedAt: Date.now(),
            cooldown
          });
          await userData.save();

          setTimeout(async() => {
            delete userData.cooldowns[commandName];
            await userData.save();
          }, command.cooldown);
        }
      } catch(error) {
        await message.reply(`boota bir hata oluştu, lütfen geliştiriciye ulaş: ${error.name}`)
      }
    }
  }
});
