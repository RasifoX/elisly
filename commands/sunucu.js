const Discord = require("discord.js-light");
const moment = require("moment");

module.exports = ({
  aliases: ["sb", "sunucu-bilgi"],
  description: "O sunucu hakkında bilgi verir.",
  category: "bilgilendirme",
  fetch: {
    guild: true
  },
  cooldown: 3,
  execute: (async(client, db, message, args) => {
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
    embed.setThumbnail(message.guild.iconURL({dynamic: true}));
    embed.addField("ID", message.guild.id);
    embed.addField("Sahip", message.guild.owner.toString());
    embed.addField("Boost sayısı / seviyesi", `${message.guild.premiumSubscriptionCount} **/** ${message.guild.premiumTier} seviye`);
    embed.addField("Oluşturulma tarihi", moment(message.guild.createdTimestamp).add(3, "hours").locale("tr").format("DD MMMM YYYY ddd HH:mm:ss"));
    embed.addField("Aktif özellikler", message.guild.features.length !== 0 ? message.guild.features.map((feature) => features[feature]).join(" **|** ") : "Bulunmuyor");
    embed.addField("Konum", regions[message.guild.region]);
    embed.setColor(0x00FFFF);

    await message.channel.send(embed);
  })
});
