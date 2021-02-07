module.exports = ({
  aliases: ["ping"],
  cooldown: 1.5,
  execute: (async(client, db, message, args) => {
    await message.reply(`${client.ws.ping.toFixed(2)} milisaniye gecikme süresine sahibim.`);
  })
})
