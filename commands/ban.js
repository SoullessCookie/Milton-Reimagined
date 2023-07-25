const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

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
    // Check if the user invoking the command has the necessary permissions
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'BAN_MEMBERS', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    // Get the user to ban and the reason for the ban from the command options
    const userToBan = interaction.options.getUser('user');
    const banReason = interaction.options.getString('reason');

    try {
      // Ban the user with the specified reason
      await interaction.guild.members.ban(userToBan, { reason: `Banned by ${interaction.user.tag} for ${banReason || 'no reason provided'}` });

      // Send a confirmation message indicating that the user has been banned
      await interaction.reply(`${userToBan.tag} has been banned.`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};