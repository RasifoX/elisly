const elislycord = require("./packages/elislycord");
const {MongoClient} = require("mongodb");
const fs = require("fs");

const store = require("./store.js");
const settings = require("./settings.js");

MongoClient.connect(settings.mongoURL, {
  "useNewUrlParser": true,
  "useUnifiedTopology": true
}, async(error, databaseClient) => {
  if(error) throw error;

  const db = databaseClient.db("elisly");

  fs.readdir("./events", async(error, files) => {
    if(error) throw error;

    const filesLength = files.length;
    for(let i = 0; i < filesLength; i++) {
      const file = files[i];
      const eventName = file.slice(0, -3);

      const event = require(`./events/${file}`);
      store.events.set(eventName, event);
      delete require.cache[require.resolve(`./events/${file}`)];

      console.log(`${eventName} olayı tanımlandı.`);
    }
  });

  fs.readdir("./commands", async(error, files) => {
    if(error) throw error;

    const filesLength = files.length;
    for(let i = 0; i < filesLength; i++) {
      const file = files[i];
      const commandName = file.slice(0, -3);

      const command = require(`./commands/${file}`);
      store.commands.set(commandName, command);
      delete require.cache[require.resolve(`./commands/${file}`)];

      console.log(`${commandName} komutu yüklendi.`);
    }
  });

  elislycord.connect({
    "token": settings.token,
    "activity": {
      "name": `${settings.prefix}yardım`,
      "type": 0
    },
    "status": "dnd"
  }, async(eventName, payload, client) => {
    if(store.events.has(eventName)) {
      store.events.get(eventName)(client, db, payload);
    }
  }).catch(console.error);
});
