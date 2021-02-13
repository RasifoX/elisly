const Discord = require("discord.js-light");
const settings = require("../settings.js");

module.exports = ({
  aliases: [],
  description: "Seviyeye özel rolleri ayarlar.",
  category: "seviye",
  fetchGuild: false,
  cooldown: 3,
  execute: (async(client, db, message, guild, args) => {
    const guildData = await db.collection("guilds").findOne({id: message.guild.id});
    const ranks = guildData.levelRanks;

    if(args.length === 0) {
      const embed = new Discord.MessageEmbed();
      embed.setColor(settings.color);

      if(Object.keys(guildData.levelRanks).length === 0) {
        embed.setDescription(`Bu sunucuda hiçbir seviyeye özel rol atanmamış. Atamayı öğrenmek için \`${settings.prefix}seviye-rol yardım\` yazabilirsin.`);
      } else {
        const lines = [];
        const rankKeys = Object.keys(ranks);

        for(let i = 0; i < rankKeys.length; i++) {
          lines.push(`${message.guild.roles.cache.get(rankKeys[i]).toString()} - **${ranks[rankKeys[i]]}**`);
        }

        embed.setDescription(`Komut hakkında detaylı bilgi almak için \`${settings.prefix}seviye-rol yardım\`\n${lines.join("\n")}`);
      }

      await message.channel.send(embed);
    }
  })
});
