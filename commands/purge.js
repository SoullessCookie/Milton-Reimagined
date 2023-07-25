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
    // Defer the reply to show the user that the bot is processing the command
    await interaction.deferReply();
    // Wait for 500 milliseconds (0.5 seconds) to simulate processing time (optional)
    await wait(500);

    // Check if the user has the 'MANAGE_MESSAGES' permission
    if (!interaction.member.permissions.has(['MANAGE_MESSAGES'])) {
      return await interaction.editReply('You do not have permission to use this command.');
    }

    // Get the amount of messages to purge from the command's options
    const purgeAmount = interaction.options.getInteger('amount');

    try {
      // Bulk delete the specified number of messages from the channel
      const messages = await interaction.channel.bulkDelete(purgeAmount);

      // Create an embed to show the result of the purge
      const embed = new EmbedBuilder()
        .setColor('#52FF33')
        .setTitle(`Purged ${messages.size} messages`)
        .setDescription(`Deleted ${messages.size} messages from this channel.`)
        .setTimestamp();

      // Check if the original message still exists before editing the reply
      if (interaction.replied) {
        await interaction.editReply({ embeds: [embed], ephemeral: true });
      }
    } catch (error) {
      // Handle different error scenarios

      // If the error is related to messages being older than 14 days
      if (error.code === 50034) {
        const embed = new EmbedBuilder()
          .setColor('#FF3333')
          .setTitle('Error')
          .setDescription('I can only delete messages that are less than 14 days old.')
          .setTimestamp();

        // Check if the original message still exists before editing the reply
        if (interaction.replied) {
          await interaction.editReply({ embeds: [embed], ephemeral: true });
        }
      } else {
        // If there is any other error, display a generic error message
        console.log(error)
        const embed = new EmbedBuilder()
          .setColor('#FF3333')
          .setTitle('Error')
          .setDescription('There was an error trying to delete messages.')
          .setTimestamp();

        // Check if the original message still exists before editing the reply
        if (interaction.replied) {
          await interaction.editReply({ embeds: [embed], ephemeral: true });

          const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
          if (logChannel) {
            logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
          }
        }
      }
    }
  }
};