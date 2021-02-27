const routes = ({
  channels: (guildID) => `/guilds/${guildID}/channels`,
  user: (userID) => `/users/${userID}`,
  guild: (guildID) => `/guilds/${guildID}`,
  channel: (channelID) => `/channels/${channelID}`,
  application: (applicationID) => `/applications/${applicationID}`,
  sendMessage: (channelID) =>  `/channels/${channelID}/messages`,
  deleteMessage: (channelID, messageID) => `/channels/${channelID}/messages/${messageID}`
});

const connect = (async(callback) => {
  const WebSocket = require("ws");
  const zlib = require("fast-zlib");

  const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json&compress=zlib-stream");
  const inflator = new zlib.Inflate({
    "chunkSize": 65535
  });

  ws.on("message", async(data) => {
    {
      const len = data.length;
      const flush = (len > 4) && (data[len - 4] === 0x00) && (data[len - 3] === 0x00) && (data[len - 2] === 0xff) && (data[len - 1] === 0xff);

      data = inflator.process(data, flush && zlib.Z_SYNC_FLUSH);

      if(!flush) return;

      data = JSON.parse(data.toString());
    }

    console.log(data)
  });
});

module.exports = {routes, connect};
