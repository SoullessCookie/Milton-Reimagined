const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite-create')
    .setDescription('Create an Invite to a specific channel.')
    .addChannelOption(option => option.setName('invitechannel').setDescription('The channel invite directs to').setRequired(true))
    .addBooleanOption(option => option.setName('temporaryinvite').setDescription('Should members be automatically kicked after 24 hours?'))
    .addNumberOption(option => option.setName('maxage').setMinValue(0).setDescription('Invite duration in hours (0 for forever)'))
    .addNumberOption(option => option.setName('maxuses').setMinValue(0).setDescription('Maximum uses (0 for infinite)'))
    .addStringOption(option => option.setName('reason').setDescription('Reason for creating invite'))
    .setDefaultMemberPermissions(PermissionFlagsBits.CreateInstantInvite)
    .setDMPermission(false),

  async execute(interaction) {
    try {
      const channel = interaction.options.getChannel('invitechannel');
      const channelID = channel.id;
      const temporaryBoolean = interaction.options.getBoolean('temporaryinvite') ?? false;
      const maxAgeNumber = interaction.options.getNumber('maxage') ?? 0;
      const maxAgeFinal = maxAgeNumber * 60 * 1000
      const maxUsesNumber = interaction.options.getNumber('maxuses') ?? 0;
      const reasonString = interaction.options.getString('reason') ?? 'No reason provided';
      const reasonStringFinal = `Invite created by: ${interaction.user.tag}. For the reason: ${reasonString}.`

      const invite = await interaction.guild.invites.create(channelID, {
        temporary: temporaryBoolean,
        maxAge: maxAgeFinal,
        maxUses: maxUsesNumber,
        reason: reasonStringFinal
      });

      const embed = new EmbedBuilder()
        .setColor(`#5865F2`)
        .setTitle(`Invite Created`)
        .addFields(
          { name: 'Invite Link', value: `${invite.url}` },
          { name: 'Code', value: `${invite.code}`, inline: true },
          { name: 'Temporary', value: `${invite.temporary}` },
          { name: 'Duration', value: `${invite.maxAge}` },
          { name: 'Expires', value: `${invite.expiresAt}`, inline: true },
          { name: 'Created', value: `${invite.createdAt}` },
          { name: 'Max Uses', value: `${invite.maxUses}` },
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