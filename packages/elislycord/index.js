const request = require("./request.js");
const connect = require("./connect.js");
const routes = require("./routes.js");
const createStore = require("./createStore.js");
const createEmbed = require("./createEmbed.js");
const version = require("./package.json").version;

module.exports = {connect, request, routes, createStore, createEmbed, version};
