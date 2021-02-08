const Discord = require("discord.js");
const Canvas = require("canvas");
const levelFormat = require("../methods/levelFormat.js");

module.exports = ({
  aliases: [],
  description: "O sunucuya ait seviyenizi gösterir.",
  category: "seviye",
  cooldown: 2,
  execute: (async(client, db, message, args) => {
    const users = db.collection("users");
    const userData = await users.findOne({id: message.author.id});
    const levelData = levelFormat(userData.xp);

    const canvas = Canvas.createCanvas(750, 400);
    const ctx = canvas.getContext("2d");

    // Avatar
    const avatarImage = await Canvas.loadImage(message.author.displayAvatarURL({
      format: "png"
    }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 80, 75, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, (150 - 75), (80 - 75), (75 * 2), (75 * 2));
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(150, 80, 75, 0, ((levelData.xp / levelData.needLevel) * 2) * Math.PI);
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();

    ctx.font = '22px "Comic Sans"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${levelData.xp} XP`, 100, 200);
    ctx.fillText(`${levelData.level} seviye`, 100, 230);
    ctx.fillText(`Sonraki seviye için sana ${levelData.needLevel - levelData.xp} XP gerekli`, 100, 260);
    ctx.fillText(`Sonraki seviye için toplam ${levelData.needLevel} XP gerekli`, 100, 290);
    ctx.fillText(`Bu seviyeyi %${((levelData.xp / levelData.needLevel) * 100).toFixed(2)} tamamladın.`, 100, 320)

    const image = new Discord.MessageAttachment(canvas.toBuffer(), "seviye.png");
    await message.channel.send({
      files: [image]
    });
  })
});
