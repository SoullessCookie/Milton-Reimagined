const { SlashCommandBuilder, ChannelType } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuke')
    .setDescription('Nukes a channel (not a server nuker)'),
  async execute(interaction) {
    if (!interaction.member.permissions.has('ADMINISTRATOR', 'MANAGE_CHANNELS', 'OWNER')) {
      return await interaction.reply('You do not have permission to use this command.');
    }
    if (interaction.channel.type !== ChannelType.GuildText) {
      return await interaction.reply('This isn\'t a text channel bozo');
    }


    try {
      const currentChannel = interaction.channel;
      await interaction.channel.clone();
      await interaction.channel.delete();
      const embed = new EmbedBuilder()
        .setColor('#35368b')
        .setTitle(`Channel Nuke`)
        .addFields({ name: ' ', value: `Channel ${currentChannel.name} has been nuked.` })
        .setTimestamp()
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply({ content: 'An error occurred while trying to nuke the channel.', ephemeral: true });
    }
  },
};