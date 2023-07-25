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
    // Check if the command user has sufficient permissions to unban a user
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'BAN_MEMBERS', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    // Get the user to be unbanned and the unban reason from the command options
    const userToUnban = interaction.options.getUser('user');
    const unbanReason = interaction.options.getString('reason');

    try {
      // Attempt to unban the user from the server using the guild's `unban` method
      await interaction.guild.members.unban(userToUnban, { reason: `Unbanned by ${interaction.user.tag} for ${unbanReason}` });
      // If successful, reply with a success message indicating that the user has been unbanned
      await interaction.reply(`${userToUnban.tag} has been unbanned.`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};