const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Time out a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to time out')
        .setRequired(true))
    .addNumberOption(option =>
      option.setName('duration')
        .setDescription('The duration of time out (in minutes)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for time out')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers | PermissionFlagsBits.BanMembers | PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  async execute(interaction) {

    // Get the user to be timed out and the duration from the command options
    const userToTimeout = interaction.options.getUser('user');
    const timeoutDuration = interaction.options.getNumber('duration');
    const timeoutReason = interaction.options.getString('reason');

    try {
      // Fetch the member from the guild to access the `timeout` method
      const member = await interaction.guild.members.fetch(userToTimeout.id);

      // Check if the member is not found in the guild
      if (!member) {
        return await interaction.reply('User is not a member of this server.');
      }

      // Calculate the timeout date by adding the specified duration to the current time
      const timeoutDate = new Date(Date.now() + timeoutDuration * 60000);

      // Call the `timeout` method on the member to time them out
      await member.timeout({
        reason: `Timed out by ${interaction.user.tag} for ${timeoutReason}`,
        timeout: timeoutDate
      });

      // Reply to the interaction with a success message
      await interaction.reply(`${userToTimeout.tag} has been timed out.`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};