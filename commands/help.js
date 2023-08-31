const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Provides help information'),

  async execute(interaction) {
    // Create an embed with the list of available commands and their descriptions
    const embed = new EmbedBuilder()
      .setTitle('Command Documentation')
      .setURL(`https://wrigglysplash.gitbook.io/milton-documentation/commands/administration`)
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