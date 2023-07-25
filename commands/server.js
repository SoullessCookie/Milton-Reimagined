const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),

  async execute(interaction) {
    const { guild } = interaction;
    const { owner } = await interaction.guild.fetchOwner();

    // Create an embed with basic server information
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle(`${guild.name} Server Information`)
      .addFields(
        { name: 'Owner', value: `${guild.ownerId}`, inline: true },
        { name: 'Region', value: `${guild.preferredLocale}`, inline: true },
        { name: 'Verification Level', value: `${guild.verificationLevel}`, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Emojis', value: `${guild.emojis.cache.size}`, inline: true },
      )
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTimestamp()

    try {
      // Reply to the interaction with the embed containing server information
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