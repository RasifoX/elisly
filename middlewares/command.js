const elislycord = require("../packages/elislycord");
const cooldownMiddleware = require("./cooldown.js");
const store = require("../store.js");
const settings = require("../settings.js");

module.exports = (async(client, db, payload) => {
  if(!payload.content.startsWith(settings.prefix)) return;

  const guild = await elislycord.request("GET", elislycord.routes.guild(payload.guild_id));
  const users = db.collection("users");
  const userData = await users.findOne({id: payload.author.id});

  const splittedContent = payload.content.slice(settings.prefix.length).split(" ").filter((arg) => arg !== "");
  const c = splittedContent[0];
  const args = splittedContent.slice(1);

  if(store.commands.has(c) || store.commands.some((commandData) => commandData.aliases.includes(c))) {
    const command = store.commands.has(c) ? store.commands.get(c) : store.commands.find((commandData) => commandData.aliases.includes(c));
    const commandName = store.commands.has(c) ? c : store.commands.findKey((commandData) => commandData.aliases.includes(c));

    userData.usedCommands += 1;
    await users.updateOne({id: payload.author.id}, {$set: userData});

    try {
      const stoppedByCooldown = await cooldownMiddleware(client, db, payload, command, commandName, args);

      if(!stoppedByCooldown) {
        if(command.permissions) {
          const permissions = ({
            "botOwner": "bot geliştiriciliği",
            "administrator": "yönetici",
            "manageGuild": "sunucuyu yönet",
            "manageMessages": "mesajları yönet",
            "manageRoles": "rolleri yönet",
            "manageChannels": "kanalları yönet",
            "manageEmojis": "emojileri yönet",
            "guildOwner": "sunucu sahipliği"
          });
          const missingPermissions = [];

          for(let i = 0; i < command.permissions.length; i++) {
            const userPermissions = await elislycord.calculateMemberPerms(payload.member, payload.guild_id);
            const permission = command.permissions[i];

            if(permission === "botOwner" && payload.author.id !== client.get("owner").id) {
              missingPermissions.push(permission);
            } else if(permission === "guildOwner" && payload.author.id !== payload.guild.owner_id) {
              missingPermissions.push(permission);
            } else if(!(["botOwner", "guildOwner"]).includes(permission) && !userPermissions.includes(permission)) {
              missingPermissions.push(permission);
            }
          }

          if(missingPermissions.length !== 0) {
            await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
              "content": `<@!${payload.author.id}> bu komutu kullanmak için ${missingPermissions.map((permission) => permissions[permission]).join(", ")} yetki(leri/si)ne sahip olmalısın.`
            });
            return;
          }
        }

        if((payload.author.id !== client.get("owner").id) && !command.enabled) return;

        await command.execute(client, db, payload, guild, args);
      }
    } catch(error) {
      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}> botta bir hata oluştu, lütfen geliştiriciye ulaş: \`${error.toString()}\``
      });
      console.log(error);
    }
  }
});
