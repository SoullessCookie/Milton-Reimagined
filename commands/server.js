const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Provides information about the server.'),
  async execute(interaction) {
    await interaction.deferReply();
    await wait(4000);

    const { guild } = interaction;
    const { owner } = await interaction.guild.fetchOwner();
    const embed = new EmbedBuilder()
      .setColor('BLUE')
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

    await interaction.followUp({ embeds: [embed]});
  },
};