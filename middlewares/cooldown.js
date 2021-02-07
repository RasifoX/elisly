module.exports = (async(client, db, message, command, commandName, args) => {
  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

  if(userData.cooldowns.hasOwnProperty(commandName)) {
    const cooldownData = userData.cooldowns[commandName];
    const remaining = (cooldownData.cooldown * 1000) - (Date.now() - cooldownData.usedAt);
    await message.reply(`bu komutu kullanmak için **${(remaining / 1000).toFixed(2)} saniye** beklemelisin.`)
  } else {
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
  }
});
