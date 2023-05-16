import { Events } from "discord.js";

const name = Events.ClientReady;
const kind = "once";
const execute = (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
};

const event = { name, kind, execute };

export default event;
