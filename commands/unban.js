const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for unban')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['ADMINISTRATOR *', 'BAN_MEMBERS *', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const userToUnban = interaction.options.getUser('user');
    const unbanReason = interaction.options.getString('reason');

    try {
      await interaction.guild.members.unban(userToUnban, { reason: `Unbanned by ${interaction.user.tag} for ${unbanReason}` });
      await interaction.reply(`${userToUnban} has been unbanned.`);
    } catch (error) {
      await interaction.reply('An error occurred while trying to unban the user.');
    }
  },
};