module.exports = ({
  channels: (guildID) => `/guilds/${guildID}/channels`,
  user: (userID) => `/users/${userID}`,
  guild: (guildID) => `/guilds/${guildID}`,
  channel: (channelID) => `/channels/${channelID}`,
  application: () => `/oauth2/applications/@me`,
  sendMessage: (channelID) =>  `/channels/${channelID}/messages`,
  deleteMessage: (channelID, messageID) => `/channels/${channelID}/messages/${messageID}`,
  avatar: ((user) => {
    const isGIF = user.avatar && user.avatar.startsWith("a_");
    return (user.avatar ?
      (isGIF ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif` : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`)
    : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`);
  }),
  icon: ((guild) => {
    const isGIF = guild.icon && guild.icon.startsWith("a_");

    return (guild.icon ?
      (isGIF ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif` : `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`)
    : null)
  })
});
