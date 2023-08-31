const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for kick')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers | PermissionFlagsBits.KickMembers)
    .setDMPermission(false),

  async execute(interaction) {
    // Get the user to be kicked and the reason for the kick (if provided)
    const userToKick = interaction.options.getUser('user');
    const kickReason = interaction.options.getString('reason');

    try {
      // Attempt to kick the user from the server with the provided reason
      await interaction.guild.members.kick(userToKick, { reason: `Kicked by ${interaction.user.tag} for ${kickReason}` });
      await interaction.reply(`${userToKick} has been kicked.`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};