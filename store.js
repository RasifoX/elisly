const elislycord = require("./packages/elislycord");
const commands = elislycord.createStore();
const events = elislycord.createStore();

module.exports = {commands, events};
