const FormData = require("form-data");
const fetch = require("node-fetch");
const privateStore = require("./privateStore.js");

module.exports = (async(method, url, body = {}) => {
  let request;

  if(method === "GET" || method === "DELETE") {
    request = [`https://discord.com/api/v8${url}`, {
      method,
      "headers": {
        "Authorization": `Bot ${privateStore.get("token")}`,
        "Content-Type": "application/json"
      }
    }];
  } else if(method === "POST" || method === "PATCH") {
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

      request = [`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": form.getHeaders()["content-type"]
        },
        "body": form
      }];
    } else {
      request = [`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
      }];
    }
  }

  return new Promise((resolve) => {
    (async() => {
      let data = await fetch(...request).then((res) => res.json());

      if(data.retry_after) {
        setTimeout(async() => {
          data = await fetch(...request).then((res) => res.json());
          resolve(data);
        }, data.retry_after);
      } else {
        resolve(data);
      }
    })();
  });
});
