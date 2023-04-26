const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
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
    if (!interaction.member.permissions.has(['MANAGE_MESSAGES'])) {
      return await interaction.editReply('You do not have permission to use this command.');
    }

    const purgeAmount = interaction.options.getInteger('amount');

    try {
      const messages = await interaction.channel.bulkDelete(purgeAmount);
      const embed = new EmbedBuilder()
        .setColor('#52FF33')
        .setTitle(`Purged ${messages.size} messages`)
        .setDescription(`Deleted ${messages.size} messages from this channel.`)
        .setTimestamp();
      if (interaction.replied) { // check if original message exists before editing
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      if (error.code === 50034) {
        const embed = new EmbedBuilder()
          .setColor('#FF3333')
          .setTitle('Error')
          .setDescription('I can only delete messages that are less than 14 days old.')
          .setTimestamp();
        if (interaction.replied) { // check if original message exists before editing
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      } else {
        console.log(error)
        const embed = new EmbedBuilder()
          .setColor('#FF3333')
          .setTitle('Error')
          .setDescription('There was an error trying to delete messages.')
          .setTimestamp();
        if (interaction.replied) { // check if original message exists before editing
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      }
    }
  }
};