const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('funfact')
    .setDescription('Provides a fun fact'),

  async execute(interaction) {
    // Import 'node-fetch' dynamically
    const fetch = await import('node-fetch');

    // Fetch a random fun fact from the 'uselessfacts' API
    const fact = await fetch.default('https://uselessfacts.jsph.pl/random.json?language=en')
      .then(response => response.json())
      .then(data => data.text);

    // Create an embed to display the fun fact
    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Useless Fun Fact`)
      .addFields({ name: ' ', value: `${fact}` })
      .setTimestamp();

    try {
      // Reply with the embed containing the fun fact
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};