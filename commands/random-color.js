const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-color')
    .setDescription('Returns a random hex color.'),

  async execute(interaction) {

    // Generate a random hex color
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // Create an embed with the color and send it as a response
    const embed = new EmbedBuilder()
      .setColor(`#${randomColor}`)
      .setTitle(`Random Hex Color`)
      .setDescription(`#${randomColor}`)
      .setTimestamp();

    try {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      await interaction.reply({ content: 'An error occurred while trying to use this command.', ephemeral: true });
    }
  },
};