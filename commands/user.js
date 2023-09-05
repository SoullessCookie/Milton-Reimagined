const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about a user.'),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    try {
      // Get information about the user who ran the command and the time they joined the guild
      const username = interaction.user.username;
      const joinedAt = interaction.member.joinedAt;

      // Reply with a message containing the user's username and the time they joined the guild
      await interaction.reply(`This command was run by ${username}, who joined on ${joinedAt}.`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};