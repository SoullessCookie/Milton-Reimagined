const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random-color')
    .setDescription('Returns a random hex color.'),

  async execute(interaction) {
    // Generate a random hexadecimal color code (e.g., "FFFFFF" for white)
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

    // Create an embed with the generated color and send it as a response
    const embed = new EmbedBuilder()
      .setColor(`#${randomColor}`)
      .setTitle(`Random Hex Color`)
      .setDescription(`#${randomColor}`)
      .setTimestamp();

    try {
      // Reply to the interaction with the embed containing the random color
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      // If an error occurs during the process, reply with an error message
      await interaction.reply({ content: 'An error occurred while trying to use this command.', ephemeral: true });
    }
  },
};