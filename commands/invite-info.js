const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildScheduledEvents] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite-info')
    .setDescription('Information about a specified Invite.')
    .addStringOption(option => option.setName('invite').setDescription('Invite link or code').setRequired(true)),

  async execute(interaction) {
    try {
      const inviteInfo = interaction.options.getString('invite');

      const invite = await client.fetchInvite(inviteInfo);

      const embed = new EmbedBuilder()
        .setColor(`#5865F2`)
        .setTitle(`Invite Info`)
        .addFields(
          { name: 'Invite Link', value: `${invite.url}` },
          { name: 'Code', value: `${invite.code || 'No information'}`, inline: true },
          { name: 'Channel', value: `${invite.channel || 'No information'}` },
          { name: 'Created', value: `${invite.createdAt || 'No information'}` },
          { name: 'Expires', value: `${invite.expiresAt || 'No information'}`, inline: true },
          { name: 'Guild Name', value: `${invite.guild.name || 'No information'}` },
          { name: 'Guild ID', value: `${invite.guild.id || 'No information'}` },
          { name: 'Guild Description', value: `${invite.guild.description || 'No information'}` },
          { name: 'Partnered', value: `${invite.guild.partnered || 'No information'}` },
          { name: 'Scheduled Event', value: `${invite.guildScheduledEvent || 'No information'}` },
          { name: 'Inviter', value: `${invite.inviter || 'No information'}` },
          { name: 'Inviter ID', value: `${invite.inviterId || 'No information'}`, inline: true },
          { name: 'Member Count', value: `${invite.memberCount || 'No information'}` },
          { name: 'Online Users', value: `${invite.presenceCount || 'No information'}` },
          { name: 'User Streaming', value: `${invite.targetUser || 'No information'}` },
        )
        .setThumbnail(invite.guild.iconURL({ dynamic: true }))
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};
client.login(process.env.token);