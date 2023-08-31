const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};