module.exports = (async(client, db, message) => {
  const users = db.collection("users");
  const userData = await users.findOne({id: message.author.id});

  const xp = Math.floor(Math.random() * 12);
  userData.xp += xp;

  await users.updateOne({id: message.author.id}, {$set: userData});
});
