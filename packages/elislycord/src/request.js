const FormData = require("form-data");
const fetch = require("node-fetch");
const privateStore = require("./privateStore.js");

module.exports = (async(method, url, body = {}) => {
  let data;

  if(method === "GET") {
    data = await fetch(`https://discord.com/api/v8${url}`, {
      method,
      "headers": {
        "Authorization": `Bot ${privateStore.get("token")}`,
        "Content-Type": "application/json"
      }
    }).then((result) => result.json())
  } else if(method === "POST") {
    if(body.files) {
      const form = new FormData();

      for(let i = 0; i < body.files.length; i++) {
        const file = body.files[i];
        form.append(file.name, file.blob, file.name);
      }

      delete body.files;

      if(Object.keys(body).length !== 0) {
        form.append("payload_json", JSON.stringify(body));
      }

      data = await fetch(`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": form.getHeaders()["content-type"]
        },
        "body": form
      }).then((result) => result.json());
    } else {
      data = await fetch(`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
      }).then((result) => result.json());
    }
  }

  return data;
});
