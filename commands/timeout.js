const { SlashCommandBuilder } = require('discord.js');

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
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'BAN_MEMBERS', 'OWNER', 'MODERATE_MEMBERS'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const userToTimeout = interaction.options.getUser('user');
    const timeoutDuration = interaction.options.getNumber('duration');
    const timeoutReason = interaction.options.getString('reason');

    try {
      const channel = interaction.channel;
      const member = await interaction.guild.members.fetch(userToTimeout.id);

      if (!member) {
        return await interaction.reply('User is not a member of this server.');
      }

      const timeoutDate = new Date(Date.now() + timeoutDuration * 60000);
      await member.timeout({
        reason: `Timed out by ${interaction.user.tag} for ${timeoutReason}`,
        timeout: timeoutDate
      });
      await interaction.reply(`${userToTimeout.tag} has been timed out.`);
    } catch (error) {
      console.log(error);
      await interaction.reply('An error occurred while trying to time out the user.');
    }
  },
};