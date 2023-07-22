const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.'),
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
      // If there's an error during the execution, reply with an error message
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }
  },
};