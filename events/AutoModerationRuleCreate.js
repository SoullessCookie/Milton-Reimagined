const { Client, Events, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });

const triggerTypeNames = {
  1: 'Keyword',
  4: 'KeywordPreset',
  5: 'MentionSpam',
  3: 'Spam',
};

module.exports = {
  name: Events.AutoModerationRuleCreate,
  once: true,
  async execute(autoModerationRule) {
    // Get the relevant data from the AutoModerationRule object
    const guildId = autoModerationRule.guild.id;
    const ruleName = autoModerationRule.name;
    const triggerType = autoModerationRule.triggerType;
    const triggerTypeName = triggerTypeNames[triggerType] || 'Unknown'; // Use 'Unknown' for any unknown trigger type
    const actions = autoModerationRule.actions.map((action, index) => `Action ${index + 1}:\nType: ${action.type}\nData: ${action.data || 'Not Available'}`).join('\n\n');
    const creatorId = autoModerationRule.creatorId;
    const enabled = autoModerationRule.enabled;
    const eventType = autoModerationRule.eventType;
    const exemptChannels = autoModerationRule.exemptChannels?.map(channel => channel.name).join(', ') || 'None';
    const exemptRoles = autoModerationRule.exemptRoles?.map(role => role.name).join(', ') || 'None';
    const ruleId = autoModerationRule.id;
    const triggerMetadata = autoModerationRule.triggerMetadata;
    const triggerMetadataString = JSON.stringify(triggerMetadata, null, 2);
    const keywords = triggerMetadata.keywordFilter || [];
    const keywordsString = keywords.join(', ');

    // Create the embed to send the information
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('New Auto Moderation Rule Created')
      .addFields(
        { name: 'Guild ID:', value: `${guildId}`, inline: true },
        { name: 'Rule Name:', value: `${ruleName}`, inline: true },
        { name: 'Trigger Type:', value: `${triggerTypeName}`, inline: true },
        { name: 'Actions:', value: `${actions}`, inline: true },
        { name: 'Creator ID:', value: `<@${creator.id}>`, inline: true },
        { name: 'Enabled:', value: `${enabled}`, inline: true },
        { name: 'Event Type:', value: `${eventType}`, inline: true },
        { name: 'Exempt Channels:', value: `${exemptChannels}`, inline: true },
        { name: 'Exempt Roles:', value: `${exemptRoles}`, inline: true },
        { name: 'Rule ID:', value: `${ruleId}`, inline: true },
        { name: 'Trigger Metadata:', value: `${keywordsString}`, inline: true },
      )
      .setTimestamp();

    // Send the embed to a log channel or any other desired channel
    try {
      // Send the embed to the log channel or any other desired channel
      client.channels.fetch('1133160905824280693')
        .then(channel => channel.send({ embeds: [embed] }))
    } catch (error) {
      console.error('Error sending embed:', error);
    }
  },
};
client.login(process.env.token);