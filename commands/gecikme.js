const elislycord = require("../packages/elislycord");

module.exports = ({
  enabled: false,
  aliases: ["ping"],
  description: "Botun gecikme süresini gösterir.",
  category: "genel",
  permissions: [],
  fetch: [],
  cooldown: 1.5,
  execute: (async(client, db, payload, args) => {
    await elislycord.request(client, "POST", elislycord.routes.sendMessage(payload.channel_id), {
      "content": `${client.get("ping")} milisaniye gecikme süresine sahibim.`
    });
  })
});
