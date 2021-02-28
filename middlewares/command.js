const elislycord = require("../packages/elislycord");
const cooldownMiddleware = require("./cooldown.js");
const store = require("../store.js");
const settings = require("../settings.js");

module.exports = (async(client, db, payload) => {
  if(!payload.content.startsWith(settings.prefix)) return;

  const users = db.collection("users");
  const userData = await users.findOne({id: payload.author.id});

  const c = payload.content.slice(settings.prefix.length).split(" ")[0];
  const args = payload.content.slice(settings.prefix.length).split(" ").slice(1);

  if(store.commands.has(c) || store.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = store.commands.has(c) ? store.commands.get(c) : store.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = store.commands.has(c) ? c : store.commands.findKey((commandData) => commandData.aliases.includes(c));

    userData.usedCommands += 1;
    await users.updateOne({id: payload.author.id}, {$set: userData});

    try {
      const botOwner = await elislycord.request(client, "GET", elislycord.routes.application()).then((application) => application.owner);
      const stoppedByCooldown = await cooldownMiddleware(client, db, payload, command, commandName, args);

      if(!stoppedByCooldown) {
        if(command.permissions) {
          /*const permissions = ({
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

          for(let i = 0; i < command.permissions.length; i++) {
            const permission = command.permissions[i];

            if(permission === "BOT_OWNER" && payload.author.id !== botOwner.id) {
              missingPermissions.push(permission);
            } else if(permission === "GUILD_OWNER" && payload.author.id !== payload.guild.owner_id) {
              missingPermissions.push(permission);
            } else if(!(["BOT_OWNER", "GUILD_OWNER"]).includes(permission) && !message.member.permissions.has(permission)) {
              missingPermissions.push(permission);
            }
          }

          if(missingPermissions.length !== 0) {
            await message.reply(`bu komutu kullanmak için ${missingPermissions.map((permission) => permissions[permission]).join(", ")} yetki${missingPermissions.length === 1 ? "sine" : "lerine"} sahip olmalısın.`);
            return;
          }*/
        }

        if(payload.author.id !== botOwner.id && !command.enabled) return;

        await command.execute(client, db, payload, args);
      }
    } catch(error) {
      await elislycord.request(client, "POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}> botta bir hata oluştu, lütfen geliştiriciye ulaş: \`${error.toString()}\``
      });
      console.log(error);
    }
  }
});
