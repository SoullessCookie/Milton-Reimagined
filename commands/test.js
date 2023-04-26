const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),

  async execute(interaction) {

    try {
      await interaction.reply(``);
    } catch (error) {
      await interaction.reply({ content: 'An error occurred while trying to use this command.', ephemeral: true });
    }
  },
};