const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, MessageAttachment } = require('discord.js');



module.exports = {
  data: new SlashCommandBuilder()
    .setName('getbeamed')
    .setDescription('Get Beamed'),

  async execute(interaction) {

    try {
      const videoPath = 'media/beamed.mov';
      const videoAttachment = new MessageAttachment(videoPath);

      await interaction.reply({ files: [videoAttachment], ephemeral: true });
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};