const Discord = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");
const limitJoin = require("../methods/limitJoin.js");
const packageData = require("../package.json");
const settings = require("../settings.js");

module.exports = ({
  aliases: ["hakkında", "bilgi", "i"],
  description: "Bot hakkında bilgi verir.",
  category: "bilgilendirme",
  fetchGuild: false,
  cooldown: 3,
  execute: (async(client, db, message, guild, args) => {
    const owner = await client.fetchApplication().then((application) => application.owner);
    const invite = await client.generateInvite({
      permissions: ["ADMINISTRATOR"]
    });

    const contributors = [];
    const links = [];
    let repository, languages;

    if(settings.githubRepository) {
      repository = await fetch(`https://api.github.com/repos/${settings.githubRepository}`).then((result) => result.json());
      languages = await fetch(`https://api.github.com/repos/${settings.githubRepository}/languages`).then((result) => result.json());

      const contributors = [];
      const contributorsData = await fetch(`https://api.github.com/repos/${settings.githubRepository}/contributors`).then((result) => result.json());

      if(Array.isArray(contributorsData)) {
        for(let i = 0; i < contributorsData.length; i++) {
          const contributor = contributorsData[i];

          if(contributor.login !== repository.owner.login) {
            contributors.push({
              name: contributor.login,
              url: contributor.url
            });
          }
        }
      }
    }

    contributors.push({
      name: "bmodb",
      url: "https://github.com/bmodb"
    });

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${client.user.username} hakkında bilgilendirme`);
    embed.setThumbnail(client.user.displayAvatarURL());
    embed.addField("Sürüm", packageData.version);
    embed.addField("Geliştirici", owner.tag);
    embed.addField("Yardımcı olanlar", contributors.length !== 0 ? limitJoin(contributors.map((contributor) => `[${contributor.name}](${contributor.url})`), " **|** ", 8) : "Bulunmuyor");

    if(settings.githubRepository) {
      embed.addField("Son güncellenme tarihi", moment(repository.pushed_at).locale("tr").format("DD MMMM YYYY ddd HH:mm:ss"));
      embed.addField("Kullanılan yazılım dilleri", limitJoin(Object.keys(languages), " **|** ", 5));
    }

    embed.addField("Yazılım sürümleri", `node ${process.version}\ndiscord.js ${Discord.version}`);
    embed.addField("Komutlar", client.commands.size);

    links.push(`[Botu ekle](${invite})`);

    if(settings.githubRepository) {
      links.push(`[GitHub](https://github.com/${settings.githubRepository})`);
    }

    embed.addField("Linkler", links.join(" **|** "));
    embed.setColor(0x00FFFF);

    await message.channel.send(embed);
  })
});
