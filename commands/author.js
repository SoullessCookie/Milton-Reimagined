const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('author')
    .setDescription('About the author/developers'),
  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#ddff57')
      .setTitle('About the Author')
      .addFields(
        { name: 'Developers', value: `SoullessCookie and RoseyNose` },
        { name: 'Github', value: `https://github.com/SoullessCookie/Milton-Reimagined` },
        { name: 'Creation Date', value: `March 9th 2023` },
        { name: 'Language', value: `English` },
        { name: 'Coding Library', value: `default Discord.js` },
        { name: 'Created Using', value: `Black Magic` },
      )
      .setThumbnail('https://imgur.com/KthB9H3')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};