import "dotenv/config";

import * as Discord from "discord.js";
import * as Errors from "../../src/core/errors.js";
import * as Commands from "../../src/commands/index.js";

const { TOKEN, CLIENT, GUILD } = process.env;

const intents = [Discord.GatewayIntentBits.Guilds];
const Client = new Discord.Client({ intents });

Client.commands = new Discord.Collection();

const reducer = (acc, [key, command]) => {
  const { data, execute } = command;
  if (data && execute) return [...acc, data.toJSON()];
  Errors.command(key);
  return acc;
};

const commands = Object.entries(Commands).reduce(reducer, []);

const rest = new Discord.REST().setToken(TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(Discord.Routes.applicationGuildCommands(CLIENT, GUILD), { body: commands });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
