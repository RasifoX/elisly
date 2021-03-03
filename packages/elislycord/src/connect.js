const privateStore = require("./privateStore.js");
const client = require("./client.js");
const request = require("./request.js");
const routes = require("./routes.js");

module.exports = (async(options, callback) => {
  const WebSocket = require("ws");
  const os = require("os");
  const zlib = require("fast-zlib");
  const erlpack = require("erlpack");

  const ws = new WebSocket("wss://gateway.discord.gg/?v=6&encoding=etf&compress=zlib-stream");

  const inflator = new zlib.Inflate({
    "chunkSize": 65535
  });


  let lastSequence = null;
  let sentAt;
  privateStore.set("token", options.token);

  ws.on("message", async(data) => {
    {
      const len = data.length;
      const flush = (len > 4) && (data[len - 4] === 0x00) && (data[len - 3] === 0x00) && (data[len - 2] === 0xff) && (data[len - 1] === 0xff);
      data = inflator.process(data, flush && zlib.Z_SYNC_FLUSH);
      if(!flush) return;
      data = erlpack.unpack(Buffer.from(new Uint8Array(data)));
    }



    if(data.op === 10) {
      const heartbeatInterval = data.d.heartbeat_interval;

      ws.send(erlpack.pack({
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
          "intents": 32767 // all intents
        }
      }));

      setInterval(async() => {
        ws.send(erlpack.pack({
          "op": 1,
          "d": lastSequence
        }));

        sentAt = Date.now();
      }, heartbeatInterval);
    } else if(data.op === 0) {
      if(data.t === "READY") {
        const owner = await request("GET", routes.application()).then((application) => application.owner);

        client.set("owner", owner);
        client.set("user", data.d.user);
        client.set("readyAt", Date.now());
      } else if(data.t === "GUILD_CREATE") {
        if(!client.has("guildCount")) client.set("guildCount", 0);
        client.add("guildCount", 1);
      } else if(data.t === "GUILD_DELETE") {
        client.add("guildCount", -1);
      }

      await callback(data.t, data.d, client);
    } else if(data.op === 11) {
      client.set("ping", (Date.now() - sentAt));
    }

    lastSequence = data.s;
  });


  ws.on("error", console.error);
  ws.on("close", console.log);
});
