import * as Discord from "discord.js";
import * as Content from "../services/content.js";
import * as Message from "../templates/messages/shops/botanist.js";

// TMP Shop Objects
const FIELDS = [
  { name: "Absinthe", value: "Brin 5 Argent" },
  { name: "Ail", value: "Unité 20 Bronze" },
  { name: "Arnica", value: "Sachet 50 Bronze" },
  { name: "Bardane", value: "Sachet 10 Bronze" },
  { name: "Curcuma", value: "Unité 2 Argent" },
  { name: "Fenouil", value: "Unité 10 Bronze" },
  { name: "Ginko", value: "Sachet 2 Argent 50 Bronze" },
  { name: "Houblon", value: "Sac 70 Bronze" },
  { name: "Menthe", value: "Botte 50 Bronze" }
];
// TMP Shop Owner
const OWNER = {
  // name: "Leah Zeikar",
  name: "Arcadia",
  gender: 1,
  occupation: [
    {
      kind: "shop",
      name: "Le Chaudron d'Arcadia",
      role: "Owner",
      specialist: "Alchimiste",
      location: "Blancherive"
    }
  ]
};

const context = ["shops", "botanist"];
const content = (...args) => Content.build(context, ...args);

const data = new Discord.SlashCommandBuilder()
  .setName("botaniste")
  .setDescription("Vend du matériel de botanique, des plantes et des onguents.")
  .addStringOption((option) =>
    option.setName("rayon").setDescription("Choix de la catégorie de produits").setAutocomplete(true)
  )
  .addStringOption((option) =>
    option.setName("section").setDescription("Choix de la catégorie de produits").setAutocomplete(true)
  );

const sections = ["Botanique", "Plantes", "Ingrédients", "Onguents"];

const presets = {
  rayons: sections,
  sections
};

const preset = async (interaction) => {
  const focused = interaction.options.getFocused(true);
  const { name, value } = focused;
  const filtered = presets[`${name}s`].filter((choice) => choice.startsWith(value));
  interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
};
const input = async (interaction) => {
  const { options } = interaction;
  const section = options.getString("rayon") || options.getString("section");
  if (sections.includes(section)) {
    const fields = FIELDS;
    const { occupation } = OWNER;
    const [current] = occupation;
    const title = await Content.build(["shop"], "title", OWNER, { ...current, ...OWNER, place: current.name });
    const description = await content("section", OWNER, { section });
    const select = new Discord.StringSelectMenuBuilder()
      .setCustomId("action")
      .setPlaceholder("Action")
      .addOptions(
        new Discord.StringSelectMenuOptionBuilder()
          .setLabel("Bulbasaur")
          .setDescription("The dual-type Grass/Poison Seed Pokémon.")
          .setValue("bulbasaur"),
        new Discord.StringSelectMenuOptionBuilder()
          .setLabel("Charmander")
          .setDescription("The Fire-type Lizard Pokémon.")
          .setValue("charmander"),
        new Discord.StringSelectMenuOptionBuilder()
          .setLabel("Squirtle")
          .setDescription("The Water-type Tiny Turtle Pokémon.")
          .setValue("squirtle")
      );

    const row = new Discord.ActionRowBuilder().addComponents(select);
    interaction.reply(Message.build({ fields, title, description }));
  } else interaction.reply(await content("none"));
};
const execute = async (interaction) => {
  if (interaction.isAutocomplete()) preset(interaction);
  if (interaction.isChatInputCommand()) input(interaction);
};

export default { data, execute };
