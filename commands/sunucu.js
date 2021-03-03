const etime = require("../packages/etime");
const elislycord = require("../packages/elislycord");

const settings = require("../settings.js");

module.exports = ({
  enabled: true,
  aliases: ["sb", "sunucu-bilgi"],
  description: "O sunucu hakkında bilgi verir.",
  category: "bilgilendirme",
  permissions: [],
  fetch: ["guild"],
  cooldown: 3,
  execute: (async(client, db, payload, args) => {
    const guild = await elislycord.request("GET", elislycord.routes.guild(payload.guild_id));
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

    const embed = elislycord.createEmbed();
    embed.setThumbnail(elislycord.routes.icon(guild));
    embed.addField("ID", guild.id);
    embed.addField("Sahip", `<@!${guild.owner_id}>`);
    embed.addField("Boost sayısı / seviyesi", `${guild.premium_subscription_count || 0} **/** ${guild.premium_tier} seviye`);
    embed.addField("Oluşturulma tarihi", etime.toTurkish(elislycord.getTimestamp(guild.id) + (3 * 60 * 60 * 1000)));
    embed.addField("Aktif özellikler", guild.features.length !== 0 ? guild.features.map((feature) => features[feature]).join(" **|** ") : "Bulunmuyor");
    embed.addField("Konum", regions[guild.region]);
    embed.setColor(settings.color);

    await elislycord.request("POST", elislycord.routes.sendMessage(payload.channel_id), {
      "embed": embed.toJSON()
    });
  })
});
