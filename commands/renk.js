const elislycord = require("../packages/elislycord");
const Canvas = require("canvas");

module.exports = ({
  enabled: true,
  aliases: [],
  description: "Belirtilen renk hakkında detaylı bilgi verir.",
  category: "araçlar",
  permissions: [],
  cooldown: 3,
  execute: (async(client, db, payload, guild, args) => {
    if(args.length === 0) {
      await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
        "content": `<@!${payload.author.id}> lütfen bir renk belirtin.`
      });
      return;
    }

    const rgbToHex = ((r, g, b) => {
      const componentToHex = ((c) => {
        const hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      });

      return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    });

    const hexToRgb = ((hex) => {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
    });

    let color;

    if(args[0].startsWith("#")) color = args[0];
    else color = rgbToHex(...args.join(" ").split(" ").map((arg) => Number(arg.endsWith(",") ? arg.slice(0, -1) : arg)));

    const canvas = Canvas.createCanvas(300, 300);
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 300, 300);

    const embed = elislycord.createEmbed();
    embed.setImage("attachment://renk.png");
    embed.addField("HEX değeri", color, true);
    embed.addField("RGB değeri", `rgb(${hexToRgb(color).join(", ")})`, true);
    embed.setColor(Number(`0x${color.slice(1)}`));

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      "embed": embed.toJSON(),
      "files": [{
        name: "renk.png",
        blob: canvas.toBuffer()
      }]
    });
  })
});
