const request = require("./request.js");
const connect = require("./connect.js");
const routes = require("./routes.js");
const createStore = require("./utilities/createStore.js");
const createEmbed = require("./utilities/createEmbed.js");
const getTimestamp = require("./utilities/getTimestamp.js");
const getMessageMentions = require("./utilities/getMessageMentions.js");
const version = require("../package.json").version;

module.exports = {connect, request, routes, createStore, createEmbed, getTimestamp, getMessageMentions, version};
