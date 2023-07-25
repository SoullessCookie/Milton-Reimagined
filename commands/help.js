const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help information'),

  async execute(interaction) {
    // Create an embed with the list of available commands and their descriptions
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

    try {
      // Reply with the embed containing the command information
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};