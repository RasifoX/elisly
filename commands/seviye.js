const Canvas = require("canvas");

const elislycord = require("../packages/elislycord");
const settings = require("../settings.js");

const getMessageMentions = require("../methods/getMessageMentions.js");
const levelFormat = require("../methods/levelFormat.js");

Canvas.registerFont("./public/uni-sans-heavy.ttf", {family: "Uni Sans Heavy"});

module.exports = ({
  enabled: true,
  aliases: [],
  description: "O sunucuya ait seviyenizi gösterir.",
  category: "seviye",
  permissions: [],
  fetch: [],
  cooldown: 2,
  execute: (async(client, db, payload, args) => {
    const messageMentions = await getMessageMentions(payload, args);
    const user = messageMentions.users.size() === 1 ? messageMentions.users.byIndex(0) : payload.author;
    const usersData = await db.collection("users").find({[`xp.${payload.guild_id}`]: {$exists: true}}).toArray();

    let rank = usersData.sort((a, b) => b.xp[payload.guild_id] - a.xp[payload.guild_id]).map((userData) => userData.id).indexOf(user.id);
    rank = rank === -1 ? usersData.length : rank;
    rank += 1;

    const userData = usersData.find((userData) => userData.id === user.id);
    const levelData = levelFormat(userData ? userData.xp[payload.guild_id] : 0);

    const canvas = Canvas.createCanvas(750, 400);
    const ctx = canvas.getContext("2d");

    // Avatar
    const avatarImage = await Canvas.loadImage(elislycord.routes.avatar(user).replace(".gif", ".png"));
    ctx.save();
    ctx.beginPath();
    ctx.arc(105, 300, 75, 0, (2 * Math.PI));
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatarImage, (105 - 75), (300 - 75), (75 * 2), (75 * 2));
    ctx.restore();

    // Stroke
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 10;
    ctx.arc(105, 300, 75, 0, (((levelData.xp / levelData.needLevel) * 2) * Math.PI));
    ctx.stroke();
    ctx.restore();

    // Texts
    ctx.font = '48px "Uni Sans Heavy"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(user.username, 30, 80);

    ctx.fillStyle = "#D7D7D7";
    ctx.fillText(user.discriminator.toString(), 30, 130);

    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right";
    ctx.fillText(`${levelData.level}. SEVİYE`, 720, 80);

    ctx.fillStyle = "#D7D7D7";
    ctx.fillText(`${rank}. SIRA`, 720, 130);
    ctx.fillText(`${levelData.xp}/${levelData.needLevel} XP`, 720, 310);

    ctx.fillStyle = "#B3B3B3";
    ctx.fillText(`GEREKEN ${levelData.needLevel - levelData.xp} XP`, 720, 360);

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      files: [{
        name: "seviye.png",
        blob: canvas.toBuffer()
      }]
    });
  })
});
