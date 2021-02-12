module.exports = ({
  aliases: ["ping"],
  description: "Botun gecikme süresini gösterir.",
  category: "genel",
  fetchGuild: false,
  cooldown: 1.5,
  execute: (async(client, db, message, guild, args) => {
    await message.reply(`${client.ws.ping.toFixed(2)} milisaniye gecikme süresine sahibim.`);
  })
});
