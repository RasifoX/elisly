const Discord = require("discord.js-light");

const applyFetch = require("../methods/applyFetch.js");
const cooldownMiddleware = require("./cooldown.js");
const settings = require("../settings.js");

module.exports = (async(client, db, message) => {
  if(!message.content.startsWith(settings.prefix)) return;

  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

  const c = message.content.slice(settings.prefix.length).split(" ")[0];
  const args = message.content.slice(settings.prefix.length).split(" ").slice(1);

  if(client.commands.has(c) || client.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = client.commands.has(c) ? client.commands.get(c) : client.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = client.commands.has(c) ? c : client.commands.findKey((commandData) => commandData.aliases.includes(c));

    const newMessage = await applyFetch(message, command.fetch, command.permissions);

    userData.usedCommands += 1;
    await users.updateOne({id: newMessage.author.id}, {$set: userData});

    try {
      const stoppedByCooldown = await cooldownMiddleware(client, db, newMessage, command, commandName, args);

      if(!stoppedByCooldown) {
        if(command.permissions) {
          const permissions = ({
            BOT_OWNER: "bot geliştiriciliği",
            ADMINISTRATOR: "yönetici",
            MANAGE_GUILD: "sunucuyu yönet",
            MANAGE_MESSAGES: "mesajları yönet",
            MANAGE_ROLES: "rolleri yönet",
            MANAGE_CHANNELS: "kanalları yönet",
            MANAGE_EMOJIS: "emojileri yönet",
            GUILD_OWNER: "sunucu sahipliği"
          });
          const missingPermissions = [];

          const botOwner = await client.fetchApplication().then((application) => application.owner);

          for(let i = 0; i < command.permissions.length; i++) {
            const permission = command.permissions[i];

            if(permission === "BOT_OWNER" && newMessage.author.id !== botOwner.id) {
              missingPermissions.push(permission);
            } if(permission === "GUILD_OWNER" && newMessage.author.id !== newMessage.guild.ownerID) {
              missingPermissions.push(permission);
            } else if(!(["BOT_OWNER", "GUILD_OWNER"]).includes(permission) && !newMessage.member.permissions.has(permission)) {
              missingPermissions.push(permission);
            }
          }

          if(missingPermissions.length !== 0) {
            await message.reply(`bu komutu kullanmak için ${missingPermissions.map((permission) => permissions[permission]).join(", ")} yetki${missingPermissions.length === 1 ? "sine" : "lerine"} sahip olmalısın.`);
            return;
          }
        }

        await command.execute(client, db, newMessage, args);
      }
    } catch(error) {
      await message.reply(`botta bir hata oluştu, lütfen geliştiriciye ulaş: \`${error.toString()}\``);
      console.log(error);
    }
  }
});
