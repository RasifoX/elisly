const fetch = require("node-fetch");

module.exports = (async(client, method, url, data = {}) => {
  let result;

  if(method === "GET") {
    data = await fetch(`https://discord.com/api/v8${url}`, {
      method,
      "headers": {
        "Authorization": `Bot ${client.get("token")}`,
        "Content-Type": "application/json"
      }
    }).then((result) => result.json())
  } else {
    data = await fetch(`https://discord.com/api/v8${url}`, {
      method,
      "headers": {
        "Authorization": `Bot ${client.get("token")}`,
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(data)
    }).then((result) => result.json())
  }

  return data;
});
