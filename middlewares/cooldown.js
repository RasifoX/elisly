const elislycord = require("../packages/elislycord");

module.exports = (async(client, db, payload, command, commandName, args) => {
  const users = db.collection("users");
  const userData = await users.findOne({id: payload.author.id});

  if(userData.cooldowns.hasOwnProperty(commandName)) {
    const cooldownData = userData.cooldowns[commandName];
    const remaining = (cooldownData.cooldown * 1000) - (Date.now() - cooldownData.usedAt);
    await elislycord.request(client, "POST", elislycord.routes.sendMessage(payload.channel_id), {
      "content": `bu komutu kullanmak için **${(remaining / 1000).toFixed(2)} saniye** beklemelisin.`
    });

    return true;
  } else {
    if(command.cooldown) {
      userData.cooldowns[commandName] = ({
        usedAt: Date.now(),
        cooldown: command.cooldown
      });
      await users.updateOne({id: payload.author_id}, {$set: userData});

      setTimeout(async() => {
        delete userData.cooldowns[commandName];
        await users.updateOne({id: payload.author_id}, {$set: userData});
      }, (command.cooldown * 1000));
    }
  }
});
