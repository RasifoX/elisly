const settings = require("../settings.js");

module.exports = (async(client, db, message) => {
  if(message.channel.type !== "text" || message.author.bot) return;

  const xp = Math.floor(Math.random() * 12);
  const users = db.collection("users");

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

  await users.updateOne({id: message.author.id}, {$set: userData});

  const c = message.content.slice(settings.prefix.length).split(" ")[0];
  const args = message.content.slice(settings.prefix.length).split(" ").slice(1);

  if(client.commands.has(c) || client.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = client.commands.has(c) ? client.commands.get(c) : client.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = client.commands.has(c) ? c : client.commands.findKey((commandData) => commandData.aliases.includes(c));

    if(userData.cooldowns.hasOwnProperty(commandName)) {
      const cooldownData = userData.cooldowns[commandName];
      const remaining = (cooldownData.cooldown * 1000) - (Date.now() - cooldownData.usedAt);
      await message.reply(`bu komutu kullanmak için **${(remaining / 1000).toFixed(2)}** saniye beklemelisin.`)
    } else {
      userData.usedCommand += 1;
      await users.updateOne({id: message.author.id}, {$set: userData});

      try {
        await command.execute(client, db, message, args);

        if(command.cooldown) {
          userData.cooldowns[commandName] = ({
            usedAt: Date.now(),
            cooldown: command.cooldown
          });
          await users.updateOne({id: message.author.id}, {$set: userData});

          setTimeout(async() => {
            delete userData.cooldowns[commandName];
            await users.updateOne({id: message.author.id}, {$set: userData});
          }, (command.cooldown * 1000));
        }
      } catch(error) {
        await message.reply(`bota bir hata oluştu, lütfen geliştiriciye ulaş: ${error.name}`);
        console.log(error);
      }
    }
  }
});
