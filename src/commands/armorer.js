import * as Discord from "discord.js";

const data = new Discord.SlashCommandBuilder()
  .setName("armurier")
  .setDescription("Vend des armes, des armures et du matériel de forge.");
const execute = async ({ reply }) => {
  await reply("Coucou");
};

const response = { data, execute };

export default response;
