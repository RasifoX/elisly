const FormData = require("form-data");
const fetch = require("node-fetch");
const privateStore = require("./privateStore.js");

const queue = [];
let interval;

module.exports = (async(method, url, body = {}) => {
  console.log(interval)
  if(method === "GET") {
    queue.push([`https://discord.com/api/v8${url}`, {
      method,
      "headers": {
        "Authorization": `Bot ${privateStore.get("token")}`,
        "Content-Type": "application/json"
      }
    }]);
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

      queue.push([`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": form.getHeaders()["content-type"]
        },
        "body": form
      }]);
    } else {
      queue.push([`https://discord.com/api/v8${url}`, {
        method,
        "headers": {
          "Authorization": `Bot ${privateStore.get("token")}`,
          "Content-Type": "application/json"
        },
        "body": JSON.stringify(body)
      }]);
    }
  }

  return new Promise((resolve) => {
    if(!interval) {
      interval = setInterval(async() => {
        if(queue.length !== 0) {
          const requestData = queue.pop();
          const data = await fetch(...requestData).then((result) => result.json());

          resolve(data);
        } else {
          clearInterval(interval);
          interval = undefined;
        }
      }, 100);
    }
  });
});
