const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('github')
    .setDescription('Link to Milton Github Page'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Milton Github`)
      .setURL('https://github.com/SoullessCookie/Milton-Reimagined')
      .setTimestamp()

    try {
      await interaction.reply(``);
    } catch (error) {
      await interaction.reply({ content: 'An error occurred while trying to use this command.', ephemeral: true });
    }
  },
};