const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Link to Milton Github Page'),

  async execute(interaction) {
    // Create an embed with the link to the Milton GitHub page
    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Milton Github`)
      .setURL('https://github.com/SoullessCookie/Milton-Reimagined')
      .setTimestamp();

    try {
      // Reply with the embed containing the link
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      // If an error occurs, reply with an error message
      await interaction.reply({ content: 'An error occurred while trying to use this command.', ephemeral: true });
    }
  },
};