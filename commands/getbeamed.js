const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('getbeamed')
    .setDescription('Get Beamed')
    .setDefaultMemberPermissions(0)
    .setDMPermission(false),

  async execute(interaction) {
    try {

      await interaction.reply({ files: ["./media/beamed.mov"], ephemeral: true });
    } catch (error) {
      console.log(error);
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};