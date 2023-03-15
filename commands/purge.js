const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages in a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to purge')
        .setRequired(true)),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'MANAGE_MESSAGES', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const purgeAmount = interaction.options.getInteger('amount');

    try {
      const messages = await interaction.channel.bulkDelete(purgeAmount);
      await interaction.reply({ content: `${messages.size} messages were purged.`, ephemeral: true });
    } catch (error) {
      if (error.code === 50034) {
        return message.reply({ content: 'I can only delete messages that are less than 14 days old.', ephemeral: true });
      } else {
        console.error(error);
        return message.reply({ content: 'There was an error trying to delete messages.', ephemeral: true });
      }
    }
  },
};
