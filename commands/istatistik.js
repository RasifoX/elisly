const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const packageData = require("../package.json");
const settings = require("../settings.js");

module.exports = ({
  aliases: ["hakkında", "bilgi", "i"],
  description: "Bot hakkında bilgi verir.",
  category: "bilgilendirme",
  fetchGuild: false,
  cooldown: 3,
  execute: (async(client, db, message, guild, args) => {
    const contributors = [];
    let repository, languages;

    if(settings.githubRepository) {
      const contributors = [];
      const repository = await fetch(`https://api.github.com/repos/${settings.githubRepository}`).then((result) => result.json());
      const languages = await fetch(`https://api.github.com/repos/${settings.githubRepository}/languages`).then((result) => result.json());
      const contributorsData = await fetch(`https://api.github.com/repos/${settings.githubRepository}/contributors`).then((result) => result.json());
      
      const owner = await client.fetchApplication().then((application) => application.owner);
      const invite = await client.generateInvite({
        permissions: ["ADMINISTRATOR"]
      });

      if(Array.isArray(contributorsData)) {
        for(let i = 0; i < contributorsData.length; i++) {
          const contributor = contributorsData[i];

          contributors.push({
            name: contributor.login,
            url: contributor.url
          });
        }
      }

      contributors.push({
        name: "bmodb",
        url: "https://github.com/bmodb"
      });
    }

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${client.user.username} hakkında bilgilendirme`);
    embed.setThumbnail(client.user.displayAvatarURL());
    embed.addField("Sürüm", packageData.version);
    embed.addField("Geliştirici", owner.tag);

    if(settings.githubRepository) {
      embed.addField("Yardımcı olanlar", contributors.map((contributor) => `[${contributor.name}](${contributor.url})`).join(" **|** "));
      embed.addField("Son güncellenme tarihi", moment(repositoryData.pushed_at).locale("tr").format("DD MMMM YYYY ddd HH:mm:ss"));
      embed.addField("Kullanılan yazılım dilleri", Object.keys(langauges).join(" **|** "));
    }

    embed.addField("Yazılım sürümleri", `node ${process.version}\ndiscord.js ${Discord.version}`);
    embed.addField("Komutlar", client.commands.size);
    embed.addField("Linkler", `[Botu ekle](${invite})`);
    embed.setColor(0x00FFFF);

    await message.channel.send(embed);
  })
});
