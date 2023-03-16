const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('funfact')
    .setDescription('Provides a fun fact'),
  async execute(interaction) {
    const fetch = await import('node-fetch');

    const fact = await fetch.default('https://uselessfacts.jsph.pl/random.json?language=en')
      .then(response => response.json())
      .then(data => data.text);


    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Useless fun fact`)
      .addFields({ name: ' ', value: `${fact}` })
      .setTimestamp()

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }
  },
};