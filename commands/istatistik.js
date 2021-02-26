const Discord = require("discord.js-light");
const fetch = require("node-fetch");
const moment = require("moment");
const os = require("os");

const limitJoin = require("../methods/limitJoin.js");
const packageData = require("../package.json");
const settings = require("../settings.js");

module.exports = ({
  enabled: true,
  aliases: ["hakkında", "bilgi", "i"],
  description: "Bot hakkında bilgi verir.",
  category: "bilgilendirme",
  permissions: [],
  fetch: [],
  cooldown: 3,
  execute: (async(client, db, message, args) => {
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
    embed.addField("Bellek kullanımı", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB **|** ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

    links.push(`[Botu ekle](${invite})`);

    if(settings.githubRepository) {
      links.push(`[GitHub](https://github.com/${settings.githubRepository})`);
    }

    if(settings.supportServer) {
      links.push(`[Destek sunucusu](https://dsicord.gg/${settings.supportServer})`);
    }

    embed.addField("Linkler", links.join(" **|** "));
    embed.setColor(settings.color);

    await message.channel.send(embed);
  })
});
