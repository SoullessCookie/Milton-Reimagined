const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help information'),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('List of available commands:')
      .addFields(
        { name: 'ping', value: 'Check if the bot is online.' },
        { name: 'info', value: 'Displays information about the bot.' },
        { name: 'help', value: 'Displays current commands.' },
        { name: 'adding more soon', value: 'Bruh' },
      )
      .setColor('#FFFF00')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};