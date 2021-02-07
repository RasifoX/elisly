const settings = require("../settings.js");

module.exports = (async(client, db) => {
  await client.user.setPresence({
    activity: {
      name: `${settings.prefix}yardım | ${client.guilds.cache.size} sunucu`
    },
    status: "idle"
  });

  console.log("Presence is setted.");

  const users = db.collection("users");
  const usersData = await users.find({$cooldown: ((d) => JSON.stringify(d) !== "{}")}).toArray();

  if(usersData.length !== 0) {
    usersData.forEach((userData) => {
      Object.keys(userData.cooldowns).forEach((commandName) => {
        const cooldownData = userData.cooldowns[commandName];
        const timeout = ((cooldownData.cooldown * 1000) - (Date.now() - cooldownData.usedAt));

        setTimeout(async() => {
          delete userData.cooldowns[commandName];
          await users.updateOne({id: userData.id}, {$set: userData});
        }, timeout);
      });
    });
  }

  console.log("Cooldowns is registered.");

  console.log("Bot is ready.");
});
