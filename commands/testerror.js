const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('testerror')
    .setDescription('Test command to throw an error intentionally'),

  async execute(interaction) {

    const authorizedId = '963991093219840000'
    if (interaction.user.id !== authorizedId) {
      await interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
      return;
    }

    try {
      throw new Error('This is a test error. The command threw this error intentionally.');
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};