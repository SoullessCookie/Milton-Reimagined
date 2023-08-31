const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');

// This is just a blank command for use later because why not?
module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('test'),

  async execute(interaction) {

    try {
      await interaction.reply(`test`);
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};