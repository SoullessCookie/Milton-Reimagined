const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nukes a channel (not a server nuker)'),
  async execute(interaction) {
    // Check if the user has the required permissions to use the command
    if (!interaction.member.permissions.has(['ADMINISTRATOR', 'MANAGE_CHANNELS', 'OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }
    // Check if the command is being executed in a text channel
    if (interaction.channel.type !== ChannelType.GuildText) {
      return await interaction.reply('This isn\'t a text channel bozo');
    }

    try {
      // Clone the current channel
      const currentChannel = interaction.channel;
      await interaction.channel.clone();

      // Delete the original channel
      await interaction.channel.delete();

      // Send a success message with an embed
      const embed = new EmbedBuilder()
        .setColor('#35368b')
        .setTitle(`Channel Nuke`)
        .addFields({ name: ' ', value: `Channel ${currentChannel.name} has been nuked.` })
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      // If an error occurs during the nuke process, reply with an error message
      console.log(error);
      await interaction.reply({ content: 'An error occurred while trying to nuke the channel.', ephemeral: true });
    }
  },
};