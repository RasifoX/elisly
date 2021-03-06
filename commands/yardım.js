module.exports = ({
  "enabled": false,
  "aliases": ["komutlar"],
  "description": "Botun komutlarını detaylı şekilde gösterir.",
  "category": "genel",
  "permissions": [],
  "cooldown": 5,
  "execute": (async(client, db, message, guild, args) => {
    const categories = ({
      "genel": "Genel komutlar",
      "bilgilendirme": "Bilgilendirme komutları",
      "seviye": "Seviye komutları",
      "eğlence": "Eğlence komutları",
      "geliştirici": "Geliştirici komutları",
      "araçlar": "Araç benzeri komutlar"
    });

    const commands = {};
    const commandKeys = client.commands.keyArray();
    let maxLength = 0;

    for(let i = 0; i < commandKeys.length; i++) {
      const command = client.commands.get(commandKeys[i]);
      const category = command.category || "kategorisiz";

      if(!commands.hasOwnProperty(category)) {
        commands[category] = [];
      }

      commands[category].push(commandKeys[i]);
    }

    const pages = [];

    for(let i = 0; i < Object.keys(commands).length; i++) {
      const page = [];
      let maxLength = 0;

      const category = Object.values(commands)[i];
      const commandCount = category.length;

      for(let a = 0; a < commandCount; a++) {
        if(category[a].length > maxLength) {
          maxLength = category[a].length;
        }
      }

      page.push(`${categories[Object.keys(commands)[i]]}\n`);

      for(let a = 0; a < commandCount; a++) {
        const commandName = category[a];
        page.push(`${commandName}${(" ").repeat(maxLength - commandName.length)} :: ${client.commands.get(commandName).description}`);
      }

      pages.push(page.join("\n"));
    }

    const formatPage = ((page) => {
      return `\`\`\`asciidoc\n${page}\`\`\``;
    });

    const helpMessage = await message.channel.send(formatPage(pages[0]));
    const emojis = ["⏪", "◀️", "▶️", "⏩", "🗑️"];
    let currentPage = 1;

    for(let i = 0; i < emojis.length; i++) {
      await helpMessage.react(emojis[i]);
    }

    const collector = await helpMessage.createReactionCollector((reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name), {
      time: 30000
    });

    collector.on("collect", async(reaction) => {
      if(helpMessage.channel.type === "text" && message.guild.me.permissions.has("MANAGE_MESSAGES")) {
        await reaction.users.remove(message.author.id);
      }

      if(reaction.emoji.name === emojis[0] && currentPage !== 1) {
        currentPage = 1;
      } else if(reaction.emoji.name === emojis[1] && currentPage !== 1) {
        currentPage -= 1;
      } else if(reaction.emoji.name === emojis[2] && currentPage !== pages.length) {
        currentPage += 1;
      } else if(reaction.emoji.name === emojis[3] && currentPage !== pages.length) {
        currentPage = pages.length;
      } else if(reaction.emoji.name === emojis[4]) {
        collector.stop();
        await helpMessage.edit("Komut sonlandırıldı, bu mesaj **3 saniye** sonra silinecek.");
        await helpMessage.delete({timeout: 3000});
        return;
      } else {
        return;
      }

      await helpMessage.edit(formatPage(pages[currentPage - 1]));
    });

    collector.on("end", async(collected, reason) => {
      await helpMessage.edit("Yardım komutu için verilen **30 saniye** bittiği için kullanım sonlandırıldı, bu mesaj **1.5 saniye** sonra silinecek.");
      await helpMessage.delete({timeout: 1500});
    });
  })
});
