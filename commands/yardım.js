module.exports = ({
  aliases: ["komutlar"],
  description: "Botun komutlarını detaylı şekilde gösterir.",
  category: "genel",
  fetch: {
    me: true
  },
  cooldown: 5,
  execute: (async(client, db, message, guild, args) => {
    const categories = ({
      genel: "Genel komutlar",
      bilgilendirme: "Bilgilendirme komutları",
      seviye: "Seviye komutları",
      eğlence: "Eğlence komutları"
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

      if(commandKeys[i].length > maxLength) {
        maxLength = commandKeys[i];
      }

      commands[category].push(commandKeys[i]);
    }



    const pages = [];

    for(let i = 0; i < Object.keys(commands).length; i++) {
      const page = [];
      
      const category = Object.values(commands)[i];
      const commandCount = category.length;

      page.push(`${categories[Object.keys(commands)[i]]}\n`);

      for(let a = 0; a < commandCount; a++) {
        const commandName = category[a];
        page.push(`${commandName}${(" ").repeat(maxLength - commandName.length)} :: ${client.commands.get(commandName).description}`);
      }

      pages.push(page.join("\n"));
    }



    const emojis = ["⏪", "◀️", "▶️", "⏩", "🗑️"];
    let currentPage = 1;

    const firstMessage = await message.reply("komutu özelden devam ettirmek istiyorsan 🇩, eğer buradan devam ettirmek istiyorsan 🇧 emojisine tıkla.");
    await firstMessage.react("🇩");
    await firstMessage.react("🇧");

    const firstCollector = await firstMessage.createReactionCollector((reaction, user) => user.id === message.author.id && (["🇩", "🇧"]).includes(reaction.emoji.name), {
      time: 30000,
      max: 1
    });

    const formatPage = ((page) => {
      return `\`\`\`asciidoc\n${page}\`\`\``;
    });

    const handleReactions = (async(helpMessage, collector, reaction) => {
      if(helpMessage.channel.type === "text") {
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

    const endCollector = (async(helpMessage, collected, reason) => {
      if(reason === "time") {
        await helpMessage.edit("Yardım komutu için verilen **30 saniye** bittiği için kullanım sonlandırıldı, bu mesaj **1.5 saniye** sonra silinecek.");
        await helpMessage.delete({timeout: 1500});
      } else if(reason === "dm-error") {
        await firstMessage.edit("Özelden mesaj atılmasını kapattığın için komut çalıştırılamadı, bu mesaj **1.5 saniye** sonra silinecek.");
        await firstMessage.delete({timeout: 1500});
      }
    });

    firstCollector.on("collect", async(reaction) => {
      if(message.guild.me.permissions.has("MANAGE_MESSAGES")) {
        await reaction.users.remove(message.author.id);
      }

      if(reaction.emoji.name === "🇩") {
        try {
          const helpMessage = await message.author.send(formatPage(pages[0]));
        } catch(error) {
          await endCollector(null, 0, "dm-error");
          return;
        }

        for(let i = 0; i < emojis.length; i++) {
          await helpMessage.react(emojis[i]);
        }

        const secondCollector = await helpMessage.createReactionCollector((reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name), {
          time: 30000
        });

        secondCollector.on("collect", async(...args) => handleReactions(helpMessage, secondCollector, ...args));
        secondCollector.on("end", async(...args) => endCollector(helpMessage, ...args));
      } else {
        const helpMessage = await message.channel.send(formatPage(pages[0]));

        for(let i = 0; i < emojis.length; i++) {
          await helpMessage.react(emojis[i]);
        }

        const secondCollector = await helpMessage.createReactionCollector((reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name), {
          time: 30000
        });

        secondCollector.on("collect", async(...args) => handleReactions(helpMessage, secondCollector, ...args));
        secondCollector.on("end", async(...args) => endCollector(helpMessage, ...args));
      }
    });

    firstCollector.on("end", async(collected, reason) => {
      if(reason === "time") {
        await firstMessage.edit("Yardım komutunun nerede çalıştırılacağının seçilmesi için verilen **30 saniye** bittiği için kullanım sonlandırıldı, bu mesaj **1.5 saniye** sonra silinecek.");
      } else {
        await firstMessage.edit("Komut çalıştırıldı, bu mesaj **1.5 saniye** sonra silinecek.");
      }

      await firstMessage.delete({timeout: 1500});
    });
  })
});
