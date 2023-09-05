const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite-delete')
    .setDescription('Delete a specified Invite.')
    .addStringOption(option => option.setName('invite').setDescription('Invite link or code').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason for deleting invite'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction) {
    try {
      const inviteDelete = interaction.options.getString('invite');
      const reasonString = interaction.options.getString('reason') ?? 'No reason provided';
      const reasonStringFinal = `Invite deleted by: ${interaction.user.tag}. For the reason: ${reasonString}.`

      const invite = await interaction.guild.invites.delete(inviteDelete, {
        reason: reasonStringFinal
      });

      const embed = new EmbedBuilder()
        .setColor(`#5865F2`)
        .setTitle(`Invite Deleted`)
        .addFields(
          { name: 'Invite', value: `${inviteDelete}` },
          { name: 'Reason', value: `${reasonStringFinal}` },
        )
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp()

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