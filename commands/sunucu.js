const Discord = require("discord.js-light");
const moment = require("moment");

module.exports = ({
  aliases: ["sb", "sunucu-bilgi"],
  description: "O sunucu hakkında bilgi verir.",
  category: "bilgilendirme",
  fetchGuild: true,
  cooldown: 3,
  execute: (async(client, db, message, guild, args) => {
    const features = ({
      ANIMATED_ICON: "Animasyonlu simge",
      BANNER: "Banner",
      COMMERCE: "Ticari sunucu",
      COMMUNITY: "Topluluk sunucusu",
      DISCOVERABLE: "Keşfedilebilir",
      FEATURABLE: "Öne çıkarılabilir",
      INVITE_SPLASH: "Özel davet resmi",
      NEWS: "Haber kanalları",
      PARTNERED: "Discord ortağı",
      VANITY_URL: "Özel davet linki",
      VERIFIED: "Doğrulanmış sunucu",
      VIP_REGIONS: "Özel sunucu konumları",
      WELCOME_SCREEN_ENABLED: "Aktif hoşgeldin ekranı",
      MEMBER_VERIFICATION_GATE_ENABLED: "Aktif kurallar ekranı",
      PREVIEW_ENABLED: "Sunucuyu görüntüleme sistemi"
    });

    const regions = ({
      russia: "Rusya",
      europe: "Avrupa",
      brazil: "Brezilya",
      japan: "Japonya",
      singapore: "Singapur",
      india: "Hindistan",
      hongkong: "Hong Kong (Çin)",
      sydney: "Sidney (Avusturalya)",
      southafrica: "Güney Afrika",
      "us-west": "Batı ABD",
      "us-east": "Doğu ABD",
      "us-south": "Güney ABD",
      "us-north": "Kuzey ABD",
      "us-central": "Orta ABD"
    });

    const embed = new Discord.MessageEmbed();
    embed.setTitle(`${guild.name} hakkında bilgilendirme`);
    embed.setThumbnail(guild.iconURL({dynamic: true}));
    embed.addField("ID", guild.id);
    embed.addField("Sahip", `<@${guild.ownerID}>`);
    embed.addField("Boost sayısı / seviyesi", `${guild.premiumSubscriptionCount} **/** ${guild.premiumTier} seviye`);
    embed.addField("Oluşturulma tarihi", moment(guild.createdTimestamp).add(3, "hours").locale("tr").format("DD MMMM YYYY ddd HH:mm:ss"));
    embed.addField("Aktif özellikler", guild.features.length !== 0 ? guild.features.map((feature) => features[feature]).join(" **|** ") : "Bulunmuyor");
    embed.addField("Konum", regions[guild.region]);
    embed.setColor(0x00FFFF);

    await message.channel.send(embed);
  })
});
