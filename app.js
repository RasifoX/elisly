const Discord = require("discord.js-light");
const {MongoClient} = require("mongodb");
const fs = require("fs");

const settings = require("./settings.js");
const client = new Discord.Client({
  cacheEmojis: false,
  cacheOverwrites: false,
  cacheGuilds: false
});

client.commands = new Discord.Collection();

MongoClient.connect(settings.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

      client.on(eventName, async(...args) => {
        await event(client, db, ...args);
      });

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

      client.commands.set(commandName, command);

      console.log(`${commandName} komutu yüklendi.`);
    }
  });
});

client.login(settings.token).catch(console.error);
