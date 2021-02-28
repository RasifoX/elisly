const client = require("./client.js");

module.exports = (async(options, callback) => {
  const WebSocket = require("ws");
  const os = require("os");
  const zlib = require("fast-zlib");

  const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=json&compress=zlib-stream");
  const inflator = new zlib.Inflate({
    "chunkSize": 65535
  });

  const intents = ({
    "GUILDS": 1 << 0,
    "GUILD_MEMBERS": 1 << 1,
    "GUILD_BANS": 1 << 2,
    "GUILD_EMOJIS": 1 << 3,
    "GUILD_INTEGRATIONS": 1 << 4,
    "GUILD_WEBHOOKS": 1 << 5,
    "GUILD_INVITES": 1 << 6,
    "GUILD_VOICE_STATES": 1 << 7,
    "GUILD_PRESENCES": 1 << 8,
    "GUILD_MESSAGES": 1 << 9,
    "GUILD_MESSAGE_REACTIONS": 1 << 10,
    "GUILD_MESSAGE_TYPING": 1 << 11,
    "DIRECT_MESSAGES": 1 << 12,
    "DIRECT_MESSAGE_REACTIONS": 1 << 13,
    "DIRECT_MESSAGE_TYPING": 1 << 14
  });

  let lastSequence = null;

  ws.on("message", async(data) => {
    {
      const len = data.length;
      const flush = (len > 4) && (data[len - 4] === 0x00) && (data[len - 3] === 0x00) && (data[len - 2] === 0xff) && (data[len - 1] === 0xff);

      data = inflator.process(data, flush && zlib.Z_SYNC_FLUSH);

      if(!flush) return;

      data = JSON.parse(data.toString());
    }

    if(data.op === 10) {
      const heartbeatInterval = data.d.heartbeat_interval;

      ws.send(JSON.stringify({
        "op": 2,
        "d": {
          "token": options.token,
          "intents": 513,
          "properties": {
            "$os": os.platform(),
            "$browser": "elislycord",
            "$device": "elislycord"
          },
          "compress": true,
          "presence": {
            "activities": options.activity ? [options.activity] : [],
            "status": options.status || "dnd"
          },
          "intents": Object.values(intents).reduce((bits, next) => bits |= next, 0)
        }
      }));

      setInterval(async() => {
        ws.send(JSON.stringify({
          "op": 1,
          "d": lastSequence
        }));
      }, heartbeatInterval);
    } else if(data.op === 0) {
      if(data.t === "READY") {
        client.set("user", data.d.user);
        client.set("guildCount", data.d.guilds.length);
      } else if(data.t === "GUILD_CREATE") {
        client.add("guildCount", 1);
      } else if(data.t === "GUILD_DELETE") {
        client.add("guildCount", -1);
      }

      await callback(data.t, data.d, client);
    }

    lastSequence = data.s;
  });

  ws.on("error", console.error);
  ws.on("close", console.log);
});
