const elislycord = require("../packages/elislycord");
const ecolor = require("../packages/ecolor");
const Canvas = require("canvas");

module.exports = ({
  "enabled": true,
  "aliases": [],
  "description": "Belirtilen renk hakkında detaylı bilgi verir.",
  "category": "araçlar",
  "permissions": [],
  "cooldown": 3,
  "execute": (async(client, db, payload, guild, args) => {
    if(args.length === 0) {
      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}> lütfen bir renk belirtin.`
      });
      return;
    }

    let color;

    if(args[0].startsWith("#")) color = args[0];
    else {
      if(args.length !== 1) args = [args.join("")];

      if(args[0].split(",").length === 3) {
        color = ecolor.rgbToHex(...args[0].split(",").map((arg) => Number(arg)))
      } else {
        color = `#${args[0]}`;
      }
    }

    console.log(color)

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 300);

    const embed = elislycord.createEmbed();
    embed.setImage("attachment://renk.png");
    embed.addField("HEX değeri", color, true);
    embed.addField("RGB değeri", `rgb(${ecolor.hexToRgb(color).join(", ")})`, true);
    embed.setColor(Number(`0x${color.slice(1)}`));

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      "embed": embed.toJSON(),
      "files": [{
        "name": "renk.png",
        "blob": canvas.toBuffer()
      }]
    });
  })
});
