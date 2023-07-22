const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const getInsult = require("insults").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insults a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to insult')
        .setRequired(true)),
  async execute(interaction) {
    // Get the targeted user from the slash command option
    const targetUser = interaction.options.getUser('user');

    // Generate a random insult using the insults library
    const randomInsultPack = getInsult();

    try {
      // Reply to the user with the insult directed at the targeted user
      await interaction.reply({ content: `${targetUser}, ${randomInsultPack}`, ephemeral: false });
    } catch (error) {
      console.error(error);
      // If an error occurs, reply with an error message
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }
  },
};