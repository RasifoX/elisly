const settings = require("../settings.js");

module.exports = (async(client) => {
  await client.user.setPresence({
    activity: {
      name: `${settings.prefix}yardım | ${client.guilds.cache.size} sunucu`
    },
    status: "idle"
  });

  console.log("Presence is setted.");

  const users = db.collection("users");
  const usersData = await db.find({$collection: ((d) => JSON.stringify(d) !== "{}")}).then((d) => d.toArray());

  if(usersData.length !== 0) {
    usersData.forEach((userData) => {
      Object.keys(userData.cooldowns).forEach((commandName) => {
        const cooldownData = userData.cooldowns[commandName];
        const timeout = ((cooldownData.cooldown * 1000) - (Date.now() - cooldownData.usedAt));

        setTimeout(async() => {
          delete userData.cooldowns[commandName];
          await userData.save();
        }, timeout);
      });
    });
  }

  console.log("Bot is ready.");
});
