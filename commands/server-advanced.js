const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-advanced')
    .setDescription('Provides advanced information about the server.'),
  async execute(interaction) {
    await interaction.deferReply();
    await wait(4000);

    const { guild } = interaction;
    const { owner } = await interaction.guild.fetchOwner();
    const embed1 = new EmbedBuilder()
      .setColor('#9fe6ff')
      .setTitle(`${guild.name} Server Information: part 1`)
      .addFields({ name: 'AFK Channel', value: `${guild.afkChannel}`, inline: true },)
      .addFields({ name: 'Created At Timestamp', value: `${guild.createdTimestamp}`, inline: true },)
      .addFields({ name: 'AFK Channel ID', value: `${guild.afkChannelId}`, inline: true },)
      .addFields({ name: 'AFK Timeout', value: `${guild.afkTimeout}`, inline: true },)
      .addFields({ name: 'Application ID', value: `${guild.applicationId}`, inline: true },)
      .addFields({ name: 'Member Count', value: `${guild.approximateMemberCount}`, inline: true },)
      .addFields({ name: 'Presence Count', value: `${guild.approximatePresenceCount}`, inline: true },)
      .addFields({ name: 'Auto Mod Rules', value: `${guild.autoModerationRules}`, inline: true },)
      .addFields({ name: 'Available', value: `${guild.available}`, inline: true },)
      .addFields({ name: 'Banner', value: `${guild.banner}`, inline: true },)
      .addFields({ name: 'Bans', value: `${guild.bans}`, inline: true },)
      .addFields({ name: 'Channels', value: `${guild.channels}`, inline: true },)
      .addFields({ name: 'Default Notification Level', value: `${guild.defaultMessageNotifications}`, inline: true },)
      .addFields({ name: 'Guild Description', value: `${guild.description}`, inline: true },)
      .addFields({ name: 'Discovery Splash', value: `${guild.discoverySplash}`, inline: true },)
      .addFields({ name: 'Explicit Filter Level', value: `${guild.explicitContentFilter}`, inline: true },)
      .addFields({ name: 'Features', value: `${guild.features}`, inline: true },)
      .addFields({ name: 'Icon', value: `${guild.icon}`, inline: true },)
      .addFields({ name: 'Guild ID', value: `${guild.id}`, inline: true },)
      .addFields({ name: 'Invites', value: `${guild.invites}`, inline: true },)
      .addFields({ name: 'Large', value: `${guild.large}`, inline: true },)
      .addFields({ name: 'Max Bitrate', value: `${guild.maximumBitrate}`, inline: true },)
      .addFields({ name: 'Max Members', value: `${guild.maximumMembers}`, inline: true },)
      .addFields({ name: 'Maximum Presences', value: `${guild.maximumPresences}`, inline: true },)
      .addFields({ name: 'Max Video Channel Users', value: `${guild.maxVideoChannelUsers}`, inline: true },)

      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setTimestamp()

    const embed2 = new EmbedBuilder()
      .setColor('#70D4F7')
      .setTitle(`${guild.name} Server Information: Part 2`)
      .addFields({ name: 'Member Count', value: `${guild.memberCount}`, inline: true },)
      .addFields({ name: 'MFA Level', value: `${guild.mfaLevel}`, inline: true },)
      .addFields({ name: 'Name', value: `${guild.name}`, inline: true },)
      .addFields({ name: 'Name Acronym', value: `${guild.nameAcronym}`, inline: true },)
      .addFields({ name: 'NSFW Level', value: `${guild.nsfwLevel}`, inline: true },)
      .addFields({ name: 'Owner ID', value: `${guild.ownerId}`, inline: true },)
      .addFields({ name: 'Partnered', value: `${guild.partnered}`, inline: true },)
      .addFields({ name: 'Locale Region', value: `${guild.preferredLocale}`, inline: true },)
      .addFields({ name: 'Premium Progress Bar', value: `${guild.premiumProgressBarEnabled}`, inline: true },)
      .addFields({ name: 'Premium Subscription Count', value: `${guild.premiumSubscriptionCount}`, inline: true },)
      .addFields({ name: 'Premium Tier', value: `${guild.premiumTier}`, inline: true },)
      .addFields({ name: 'Presences', value: `${guild.presences}`, inline: true },)
      .addFields({ name: 'Public Updates Channel', value: `${guild.publicUpdatesChannel}`, inline: true },)
      .addFields({ name: 'Public Updates Channel ID', value: `${guild.publicUpdatesChannelId}`, inline: true },)
      .addFields({ name: 'Roles', value: `${guild.roles}`, inline: true },)
      .addFields({ name: 'Rules Channel', value: `${guild.rulesChannel}`, inline: true },)
      .addFields({ name: 'Rules Channel ID', value: `${guild.rulesChannelId}`, inline: true },)
      .addFields({ name: 'Scheduled Events', value: `${guild.scheduledEvents}`, inline: true },)
      .addFields({ name: 'Shard', value: `${guild.shard}`, inline: true },)
      .addFields({ name: 'Shard ID', value: `${guild.shardId}`, inline: true },)
      .addFields({ name: 'Splash', value: `${guild.splash}`, inline: true },)
      .addFields({ name: 'Stage Instances', value: `${guild.stageInstances}`, inline: true },)
      .addFields({ name: 'Stickers', value: `${guild.stickers}`, inline: true },)
      .addFields({ name: 'System Channel', value: `${guild.systemChannel}`, inline: true },)
      .addFields({ name: 'System Channel Flags', value: `${guild.systemChannelFlags}`, inline: true },)
      .setTimestamp()

    const embed3 = new EmbedBuilder()
      .setColor('#47cfff')
      .setTitle(`${guild.name} Server Information: Part 3`)
      .addFields({ name: 'System Channel ID', value: `${guild.systemChannelId}`, inline: true },)
      .addFields({ name: 'Vanity URL Code', value: `${guild.vanityURLCode}`, inline: true },)
      .addFields({ name: 'Verification Level', value: `${guild.verificationLevel}`, inline: true },)
      .addFields({ name: 'Verified', value: `${guild.verified}`, inline: true },)
      .addFields({ name: 'Voice Adapter Creator', value: `${guild.voiceAdapterCreator}`, inline: true },)
      .addFields({ name: 'Voice States', value: `${guild.voiceStates}`, inline: true },)
      .addFields({ name: 'Widget Channel', value: `${guild.widgetChannel}`, inline: true },)
      .addFields({ name: 'Widget Channel ID', value: `${guild.widgetChannelId}`, inline: true },)
      .addFields({ name: 'Widget Enabled', value: `${guild.widgetEnabled}`, inline: true },)
      .setTimestamp()

    await interaction.followUp({ embeds: [embed1, embed2, embed3] });
  },
};