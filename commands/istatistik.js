const Discord = require("discord.js");
const packageData = require("../package.json");

module.exports = ({
  aliases: ["hakkında", "bilgi", "i"],
  description: "Bot hakkında bilgi verir.",
  category: "bilgilendirme",
  cooldown: 3,
  execute: (async(client, db, message, args) => {
    const owner = await client.fetchApplication().then((application) => application.owner);
    const invite = await client.generateInvite({
      permissions: ["ADMINISTRATOR"]
    });

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${client.user.username} hakkında bilgilendirme`);
    embed.setThumbnail(client.user.displayAvatarURL());
    embed.addField("Sürüm", packageData.version);
    embed.addField("Geliştirici", owner.tag);
    embed.addField("Yazılım sürümleri", `node ${process.version}\ndiscord.js ${Discord.version}`);
    embed.addField("Komutlar", client.commands.size);
    embed.addField("Linkler", `[Botu ekle](${invite})`);
    embed.setColor(0x00FFFF);

    await message.channel.send(embed);
  })
});
