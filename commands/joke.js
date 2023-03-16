const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const oneLinerJoke = require('one-liner-joke');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Provides a random joke'),
  async execute(interaction) {

    const getRandomJoke = oneLinerJoke.getRandomJoke({
      'exclude_tags': ['dirty', 'racist']
    });

    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Random Joke`)
      .addFields({ name: ' ', value: `${getRandomJoke.body}` })
      .setTimestamp()

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }
  },
};