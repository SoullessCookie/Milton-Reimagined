const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for ban')
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['ADMINISTRATOR *', 'BAN_MEMBERS *', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const userToBan = interaction.options.getUser('user');
    const banReason = interaction.options.getString('reason');

    try {
      await interaction.guild.members.ban(userToBan, { reason: `Banned by ${interaction.user.tag} for ${banReason}` });
      await interaction.reply(`${userToBan} has been banned.`);
    } catch (error) {
      await interaction.reply({ content: 'An error occurred while trying to ban the user.', ephemeral: true });
    }
  },
};