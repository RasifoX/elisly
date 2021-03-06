const elislycord = require("../packages/elislycord");
const etime = require("../packages/etime");
const store = require("../store.js");
const util = require("util");

const settings = require("../settings.js");
const limitJoin = require("../methods/limitJoin.js");

module.exports = ({
  "enabled": true,
  "aliases": ["eval"],
  "description": "Kod denemeni sağlar.",
  "category": "geliştirici",
  "permissions": ["botOwner"],
  "cooldown": 3,
  "execute": (async(client, db, payload, guild, args) => {
    if(args.length === 0) {
      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}>, lütfen denemem için bir kod gir.`
      });
      return;
    }

    try {
      let executedAt = process.hrtime();
      let result = eval(args.join(" "));
      executedAt = process.hrtime(executedAt);

      if(util.types.isPromise(result)) {
        result = await Promise.resolve(result);
      }

      if(result !== null && typeof result === "object") {
        result = util.inspect(result, {
          "depth": 2,
          "getters": true
        });
      }

      const embed = elislycord.createEmbed();
      embed.setTitle("Kod çalıştırıldı.");
      embed.setDescription(`${((executedAt[0] * 1000) + (executedAt[1] / 1e6)).toFixed(3)} milisaniyede çalıştırıldı.`);
      embed.addField("Kod", `\`\`\`javascript\n${limitJoin(args.join(" ").split(""), "", 1010)}\`\`\``);
      embed.addField("Sonuç", `\`\`\`javascript\n${limitJoin((`${result}`).split(""), "", 950)}\`\`\``);
      embed.addField("Sonuç türü", `\`\`\`\n${typeof result}\`\`\``);
      embed.setColor(settings.color);

      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "embed": embed
      });
    } catch(error) {
      const embed = elislycord.createEmbed();
      embed.setTitle("Bir hata oluştu.");
      embed.setDescription(`\`\`\`\n${error.toString()}\`\`\``);
      embed.setColor(0xE8251E);

      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "embed": embed
      });
    }
  })
});
