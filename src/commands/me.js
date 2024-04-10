import * as Discord from "discord.js";
import * as Content from "../services/content.js";
import * as Message from "../templates/messages/character/creation.js";
import { FOLKS, JOBS } from "../../data/character/choices.js";

const IDLE = 120_000;
const FIELDS = FOLKS;

const context = ["character", "creation"];
const content = (...args) => Content.build(context, ...args);

const data = new Discord.SlashCommandBuilder().setName("moi").setDescription("Mon personnage.");

const input = async (interaction) => {
  const fields = FIELDS;
  const title = await Content.build(["character", "creation"], "title");
  const description = await content("description");
  const select = new Discord.StringSelectMenuBuilder()
    .setCustomId("ethnic")
    .setPlaceholder("Ethnie...")
    .addOptions(
      ...fields.map(({ name, short, long }, index) => {
        return new Discord.StringSelectMenuOptionBuilder()
          .setLabel(name)
          .setDescription(short || long)
          .setValue(`${index}`);
      })
    );

  const Character = {};
  const Collector = {};

  const components = [new Discord.ActionRowBuilder().addComponents(select)];
  const response = await interaction.reply(Message.build({ title, description, components }));

  Collector.select = response.createMessageComponentCollector({
    componentType: Discord.ComponentType.StringSelect,
    IDLE
  });
  Collector.button = response.createMessageComponentCollector({ componentType: Discord.ComponentType.Button, IDLE });

  Collector.select.on("collect", async (interaction) => {
    const { values, customId } = interaction;
    const [value] = values;
    console.log({ customId });
    if (customId === "ethnic") {
      const { name, long, folks } = fields[value];
      const ethnic = name.toLowerCase();
      Character.ethnic = value;
      const description = await content("ethnic", undefined, { ethnic, long });
      const select = new Discord.StringSelectMenuBuilder()
        .setCustomId("folk")
        .setPlaceholder("Peuple...")
        .addOptions(
          ...folks.map(({ name, short, long = "" }, index) => {
            return new Discord.StringSelectMenuOptionBuilder()
              .setLabel(name)
              .setDescription(short || long)
              .setValue(`${index}`);
          })
        );
      const components = [new Discord.ActionRowBuilder({ components: [select] })];
      await interaction.update(Message.build({ title, description, components }));
    }
    if (customId === "folk") {
      const { ethnic } = Character;
      const { folks } = fields[ethnic];
      const { name: folk, long } = folks[value];
      Character.folk = value;
      const description = await content("folk", undefined, { folk, long });
      const button = new Discord.ButtonBuilder()
        .setCustomId("write")
        .setLabel("Écrire")
        .setStyle(Discord.ButtonStyle.Primary);
      const components = [new Discord.ActionRowBuilder({ components: [button] })];
      await interaction.update(Message.build({ title, description, components }));
    }
    if (customId === "job") {
      const { path, long, name: job } = JOBS[value];
      Character.job = value;
      const { name } = Character;
      const description = await content("job", undefined, { path, long, job, name });
      const button = new Discord.ButtonBuilder()
        .setCustomId("end")
        .setLabel("Commencer l'Aventure")
        .setStyle(Discord.ButtonStyle.Primary);
      const components = [new Discord.ActionRowBuilder({ components: [button] })];
      await interaction.update(Message.build({ title, description, components }));
    }
  });

  Collector.select.on("end", async (collection) => {
    // const [[, interaction]] = collection;
    // const description = await content("leave", OWNER);
    // await interaction.editReply(Message.build({ title, description }));
  });

  Collector.button.on("collect", async (interaction) => {
    const { customId } = interaction;
    if (customId === "write") {
      const components = {
        name: new Discord.TextInputBuilder()
          .setCustomId("name")
          .setLabel("Comment vous appelez-vous ?") // Ajouter un bouton de génération de pseudo
          .setStyle(Discord.TextInputStyle.Short)
      };
      const action = new Discord.ActionRowBuilder({ components: Object.values(components) });
      const modal = new Discord.ModalBuilder({ components: [action] }).setCustomId("modal").setTitle("Nom");
      await interaction.showModal(modal);
      const submitted = await interaction.awaitModalSubmit({
        time: IDLE,
        filter: (i) => i.user.id === interaction.user.id
      });
      if (submitted) {
        const [name] = Object.keys(components).map((key) =>
          submitted.fields.getTextInputValue(components[key].data.custom_id)
        );
        Character.name = name;
        const { folk: people, ethnic } = Character;
        const { folks } = fields[ethnic];
        const { name: folk } = folks[people];
        const title = await Content.build(["character", "creation"], "title");
        const description = await content("introduction", undefined, { name, folk });
        const select = new Discord.StringSelectMenuBuilder()
          .setCustomId("job")
          .setPlaceholder("Classe...")
          .addOptions(
            ...JOBS.map(({ name, short, long = "" }, index) => {
              return new Discord.StringSelectMenuOptionBuilder()
                .setLabel(name)
                .setDescription(short || long)
                .setValue(`${index}`);
            })
          );
        const jobsComponents = [new Discord.ActionRowBuilder({ components: [select] })];
        await submitted.update(Message.build({ title, description, components: jobsComponents }));
      }
    }
  });
};
const execute = async (interaction) => {
  if (interaction.isChatInputCommand()) input(interaction);
};

export default { data, execute };
