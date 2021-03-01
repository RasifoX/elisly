const elislycord = require("../packages/elislycord");
const fetch = require("node-fetch");
const moment = require("moment");
const os = require("os");
const store = require("../store.js");

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
  execute: (async(client, db, payload, args) => {
    const owner = await elislycord.request("GET", elislycord.routes.application()).then((application) => application.owner);

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

    const embed = elislycord.createEmbed();
    embed.setThumbnail(elislycord.routes.avatar(client.get("user")));
    embed.addField("Sürüm", packageData.version);
    embed.addField("Geliştirici", `${owner.username}#${owner.discriminator}`);
    embed.addField("Yardımcı olanlar", contributors.length !== 0 ? limitJoin(contributors.map((contributor) => `[${contributor.name}](${contributor.url})`), " **|** ", 8) : "Bulunmuyor");

    if(settings.githubRepository) {
      embed.addField("Son güncellenme tarihi", moment(repository.pushed_at).locale("tr").format("DD MMMM YYYY ddd HH:mm:ss"));
      embed.addField("Kullanılan yazılım dilleri", limitJoin(Object.keys(languages), " **|** ", 5));
    }

    embed.addField("Yazılım sürümleri", `node ${process.version}\nelislycord v${elislycord.version}`);
    embed.addField("Komutlar", store.commands.size());
    embed.addField("Bellek kullanımı", `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB **|** ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);

    links.push(`[Botu ekle](https://discord.com/oauth2/authorize?client_id=${client.get("user").id}&permissions=8&scope=bot)`);

    if(settings.githubRepository) {
      links.push(`[GitHub](https://github.com/${settings.githubRepository})`);
    }

    if(settings.supportServer) {
      links.push(`[Destek sunucusu](https://discord.gg/${settings.supportServer})`);
    }

    embed.addField("Linkler", links.join(" **|** "));
    embed.setColor(settings.color);

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      embed: embed.toJSON()
    });
  })
});
