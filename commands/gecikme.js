const {reply, send, MessageEmbed} = require("../packages/elislycord");

module.exports = ({
  enabled: false,
  aliases: ["ping"],
  description: "Botun gecikme süresini gösterir.",
  category: "genel",
  permissions: [],
  fetch: [],
  cooldown: 1.5,
  execute: (async(client, db, data, args) => {
    await reply(data.author.id, `${client.ws.ping.toFixed(2)} milisaniye gecikme süresine sahibim.`);
  })
});
