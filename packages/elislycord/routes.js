module.exports = ({
  channels: (guildID) => `/guilds/${guildID}/channels`,
  user: (userID) => `/users/${userID}`,
  guild: (guildID) => `/guilds/${guildID}`,
  channel: (channelID) => `/channels/${channelID}`,
  application: (applicationID) => `/applications/${applicationID}`,
  sendMessage: (channelID) =>  `/channels/${channelID}/messages`,
  deleteMessage: (channelID, messageID) => `/channels/${channelID}/messages/${messageID}`
});
