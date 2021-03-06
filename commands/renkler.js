const elislycord = require("../packages/elislycord");
const fetch = require("node-fetch");
const getColors = require("get-image-colors");
const FileType = require("file-type");
const Canvas = require("canvas");
const {yiq} = require("yiq");

module.exports = ({
  enabled: true,
  aliases: [],
  description: "Belirtilen kullanıcının profil resminin renklerini gösterir.",
  category: "araçlar",
  permissions: [],
  fetch: ["guild"],
  cooldown: 3,
  execute: (async(client, db, payload, guild, args) => {
    const messageMentions = await elislycord.getMessageMentions(payload, args);
    const user = messageMentions.users.size() === 1 ? messageMentions.users.byIndex(0) : payload.author;

    const avatarBuffer = await fetch(elislycord.routes.avatar(user).replace(".gif", ".png")).then((result) => result.buffer());
    const fileType = await FileType.fromBuffer(avatarBuffer).then((result) => result.mime);
    const colors = await getColors(avatarBuffer, fileType);

    const canvas = Canvas.createCanvas(colors.length * 200, 400);
    const ctx = canvas.getContext("2d");

    for(let i = 0; i < colors.length; i++) {
      const color = colors[i];

      ctx.fillStyle = color;
      ctx.fillRect((i * 200), 0, 200, 400);

      ctx.fillStyle = yiq(color.toString().toLowerCase());
      ctx.font = "normal 23px Arial";
      ctx.textAlign = "center";
      ctx.fillText(color.toString().toUpperCase(), ((i * 200) + 100), 150);
      ctx.fillText(`rgb(${color._rgb[0]}, ${color._rgb[1]}, ${color._rgb[2]})`, ((i * 200) + 100), 170);
    }

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      files: [{
        name: "renkler.png",
        blob: canvas.toBuffer()
      }]
    });
  })
});
