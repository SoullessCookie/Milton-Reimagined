const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
        .setRequired(false)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['ADMINISTRATOR *', 'KICK_MEMBERS *', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const userToKick = interaction.options.getUser('user');
    const kickReason = interaction.options.getString('reason');

    try {
      await interaction.guild.members.kick(userToKick, { reason: `Kicked by ${interaction.user.tag} for ${kickReason}` });
      await interaction.reply(`${userToKick} has been kicked.`);
    } catch (error) {
      await interaction.reply({ content: 'An error occurred while trying to kick the user.', ephemeral: true });
    }
  },
};