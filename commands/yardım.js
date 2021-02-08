module.exports = ({
  aliases: ["komutlar"],
  description: "Botun komutlarını detaylı şekilde gösterir.",
  category: "genel",
  cooldown: 5,
  execute: (async(client, db, message, args) => {
    const categories = ({
      genel: "Genel komutlar",
      bilgilendirme: "Bilgilendirme komutları"
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
      const categoryLength = category.length;

      page.push(`${categories[Object.keys(commands)[i]]}\n`);

      for(let a = 0; a < categoryLength; a++) {
        const commandName = category[a];
        page.push(`${commandName}${("").repeat(maxLength - commandName.length)} :: ${client.commands.get(commandName).description}`);
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
      await reaction.users.remove(message.author.id);

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
        await helpMessage.edit("Komut sonlandırıldı, bu mesaj **5 saniye** sonra kendini imha edecektir.");
        await helpMessage.delete({timeout: 5000});
        return;
      } else {
        return;
      }

      await helpMessage.edit(formatPage(pages[currentPage - 1]));
    });

    const endCollector = (async(helpMessage, collected, reason) => {
      if(reason === "time") {
        await helpMessage.edit("Yardım komutu için verilen **30 saniye** bittiği için kullanım sonlandırıldı, bu mesaj **2.5 saniye** sonra silinecek.");
        await helpMessage.delete({timeout: 2500});
      }
    });

    firstCollector.on("collect", async(reaction) => {
      await reaction.users.remove(message.author.id);

      if(reaction.emoji.name === "🇩") {
        const helpMessage = await message.author.send(formatPage(pages[0]));

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
        await firstMessage.edit("Yardım komutu için verilen **30 saniye** bittiği için kullanım sonlandırıldı, bu mesaj **2.5 saniye** sonra silinecek.");
      } else {
        await firstMessage.edit("Komut çalıştırıldı, bu mesaj **2.5 saniye** sonra silinecek.");
      }

      await firstMessage.delete({timeout: 2500});
    });
  })
});
