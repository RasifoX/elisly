const request = require("../request.js");
const createStore = require("./createStore.js");

module.exports = (async(member, guildID) => {
  const result = [];
  let permissions;
  let roles = await request("GET", `/guilds/${guildID}/roles`);
  roles = roles.filter((role) => member.roles.some((memberRole) => memberRole === role.id || role.id === guildID));

  const flags = ({
    "createInstantInvite": 1,
    "kickMembers": 1 << 1,
    "banMembers": 1 << 2,
    "administrator": 1 << 3,
    "manageChannels": 1 << 4,
    "manageGuild": 1 << 5,
    "addReactions": 1 << 6,
    "viewAuditLogs": 1 << 7,
    "voicePrioritySpeaker": 1 << 8,
    "stream": 1 << 9,
    "readMessages": 1 << 10,
    "sendMessages": 1 << 11,
    "sendTTSMessages": 1 << 12,
    "manageMessages": 1 << 13,
    "embedLinks": 1 << 14,
    "attachFiles": 1 << 15,
    "readMessageHistory": 1 << 16,
    "mentionEveryone": 1 << 17,
    "externalEmojis": 1 << 18,
    "viewGuildInsights": 1 << 19,
    "voiceConnect": 1 << 20,
    "voiceSpeak": 1 << 21,
    "voiceMuteMembers": 1 << 22,
    "voiceDeafenMembers": 1 << 23,
    "voiceMoveMembers": 1 << 24,
    "voiceUseVAD": 1 << 25,
    "changeNickname": 1 << 26,
    "manageNicknames": 1 << 27,
    "manageRoles": 1 << 28,
    "manageWebhooks": 1 << 29,
    "manageEmojis": 1 << 30,
  });

  const keys = Object.keys(flags);
  const values = Object.values(flags);

  for(let i = 0; i < roles.length; i++) {
    for(let a = 0; a < keys.length; a++) {
      if((Number(roles[i].permissions) & values[a]) === values[a]) {
        result.push(keys[a]);
      }
    }
  }

  return result;
});
