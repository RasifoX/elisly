const elislycord = require("../packages/elislycord");

module.exports = ({
  enabled: true,
  aliases: ["ping"],
  description: "Botun gecikme süresini gösterir.",
  category: "genel",
  permissions: [],
  fetch: [],
  cooldown: 1.5,
  execute: (async(client, db, payload, guild, args) => {
    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      "content": `**${client.get("ping") || 0} milisaniye** gecikme süresine sahibim.`
    });
  })
});
