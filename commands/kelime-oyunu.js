const commonTags = require("common-tags");
const settings = require("../settings.js");

module.exports = ({
  "enabled": false,
  "aliases": ["kelimeoyunu"],
  "description": "Kelime oyunu hakkında bilgi verir.",
  "category": "eğlence",
  "permissions": ["manageChannels"],
  "cooldown": 4,
  "execute": (async(client, db, message, guild, args) => {
    const messageMentions = await getMessageMentions(message, args);

    const guilds = db.collection("guilds");
    const guildData = await guilds.findOne({id: message.guild.id});

    const formatAward = (async(awardData) => {
      if(awardData.type === "xp") {
        return `${awardData.wordCount} kelime başına ${awardData.award} XP`;
      } else if(awardData.type === "ecoin") {
        return `${awardData.wordCount} kelime başına ${awardData.award} e-coin`;
      } else if(awardData.type === "role") {
        const role = await message.guild.roles.fetch(awardData.award, false);
        return `${awardData.wordCount} kelimeye ${role.name} rolü`;
      }
    });

    if(args.length === 0) {
      const channel = guildData.wordGame.channel.id ? `<#${guildData.wordGame.channel.id}>` : null;
      const award = guildData.wordGame.award.award ? await formatAward(guildData.wordGame.award) : null;

      await message.channel.send(commonTags.stripIndents`
        **Kanal:** ${channel || "Bulunmuyor"}
        **Ödül:** ${award || "Bulunmuyor"}

        \`${settings.prefix}kelime-oyunu ayarla ödül kelimeSayısı ödülTipi (ecoin-xp-rol) değer\` **|** \`${settings.prefix}kelime-oyunu ayarla kanal #kanal\` komutlarını uygulayarak istediğin veriyi ayarlayabilirsin.
        \`${settings.prefix}kelime-oyunu göster ödül\` **|** \`${settings.prefix}kelime-oyunu göster kanal\` komutlarını kullanarak istediğin verinin detaylarını görüntüleyebilirsin.
      `);
    } else if(args[0] === "ayarla") {
      if(args[1] === "kanal") {
        const channel = messageMentions.channels.first();

        if(!channel) {
          await message.reply("lütfen geçerli bir kanal belirt.");
          return;
        }

        guildData.wordGame.channel.id = channel.id;
        guildData.wordGame.channel.updatedAt = Date.now();
        guildData.wordGame.channel.updatedBy = message.author.id;

        await guilds.updateOne({id: message.guild.id}, {$set: guildData});
        await message.reply("kanal değiştirildi.");
      } else if(args[1] === "ödül") {
        if(!args[2]) {
          await message.reply("geçerli bir değer gir. (kelimeSayısı)");
          return;
        } else if(isNaN(args[2]) || args[2].includes("+") || args[2].includes("-")) {
          await message.reply("geçersiz bir değer girdin, lütfen bir sayı gir. (kelimeSayısı)");
          return;
        }

        if(!args[3]) {
          await message.reply("geçerli bir değer gir. (ödülTipi)");
          return;
        } else if(!(["rol", "ecoin", "xp"]).includes(args[3])) {
          await message.reply("geçersiz bir değer girdin, lütfen \"xp\" \"ecoin\" \"rol\" değerlerinden birini gir. (ödülTipi)");
          return;
        }

        if(args[3] === "rol" && messageMentions.roles.size === 0) {
          await message.reply("geçersiz bir değer girdin, lütfen bir rol gir. (değer)");
          return;
        } else if((["ecoin", "xp"]).includes(args[3]) && (isNaN(args[4]) || args[4].includes("+") || args[4].includes("-"))) {
          await message.reply("geçersiz bir değer girdin, lütfen bir sayı gir. (değer)");
          return;
        }

        guildData.wordGame.award.type = args[3] === "rol" ? "role" : args[3];
        guildData.wordGame.award.award = messageMentions.roles.size !== 1 ? Number(args[4]) : messageMentions.roles.first().id;
        guildData.wordGame.award.wordCount = Number(args[2]);
        guildData.wordGame.award.updatedAt = Date.now();
        guildData.wordGame.award.updatedBy = message.author.id;

        await guilds.updateOne({id: message.guild.id}, {$set: guildData});
        await message.reply("ödül değiştirildi.");
      }
    } else if(args[0] === "göster") {
      if(args[1] === "ödül") {
        const awardIsSetted = !!guildData.wordGame.award.type;
        const types = ({
          role: "Rol",
          ecoin: "E-Coin",
          xp: "XP"
        });

        const embed = new Discord.MessageEmbed();
        embed.setDescription(commonTags.stripIndents`
          **Ödül türü:** ${awardIsSetted ? types[guildData.wordGame.award.type] : "Bulunmuyor"}
          **Ödül:** ${awardIsSetted ? types[guildData.wordGame.award.type] : "Bulunmuyor"}
          **Ödülü almak için gerekli kelime sayısı:** ${awardIsSetted ? guildData.wordGame.award.wordCount : "Bulunmuyor"}
          **Ne zaman değiştirildi:** ${awardIsSetted ? moment(guildData.wordGame.award.updatedAt).locale("tr").format("DD MMMM YYYY ddd HH:mm:ss") : "Bulunmuyor"}
          **Kim tarafından değiştirildi:** ${awardIsSetted ? `<@${guildData.wordGame.award.updatedBy}>` : "Bulunmuyor"}
        `);
        embed.setColor(settings.color);

        await message.channel.send(embed);
      }
    }
  })
});
