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
    // Check if the user has the required permissions to use the command
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'KICK_MEMBERS', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    // Get the user to be kicked and the reason for the kick (if provided)
    const userToKick = interaction.options.getUser('user');
    const kickReason = interaction.options.getString('reason');

    try {
      // Attempt to kick the user from the server with the provided reason
      await interaction.guild.members.kick(userToKick, { reason: `Kicked by ${interaction.user.tag} for ${kickReason}` });
      await interaction.reply(`${userToKick} has been kicked.`);
    } catch (error) {
      // If an error occurs during the kick process, reply with an error message
      await interaction.reply({ content: 'An error occurred while trying to kick the user.', ephemeral: true });
    }
  },
};