const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purge messages in a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to purge')
        .setRequired(true)),

  async execute(interaction) {
    await interaction.deferReply();
    await wait(500);
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'MANAGE_MESSAGES', 'OWNER'])) {
      return await interaction.editReply('You do not have permission to use this command.');
    }

    const purgeAmount = interaction.options.getInteger('amount');

    try {
      const messages = await interaction.channel.bulkDelete(purgeAmount);
      if (interaction.replied) { // check if original message exists before editing
        await interaction.editReply({ content: `${messages.size} messages were purged.`, ephemeral: true });
      }
    } catch (error) {
      if (error.code === 50034) {
        if (interaction.replied) { // check if original message exists before editing
          await interaction.editReply({ content: 'I can only delete messages that are less than 14 days old.', ephemeral: true });
        }
      } else {
        console.log(error)
        if (interaction.replied) { // check if original message exists before editing
          await interaction.editReply({ content: 'There was an error trying to delete messages.', ephemeral: true });
        }
      }
    }
  }
};