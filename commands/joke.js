const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const oneLinerJoke = require('one-liner-joke');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Provides a random joke'),
  async execute(interaction) {
    // Get a random joke using the one-liner-joke library
    const getRandomJoke = oneLinerJoke.getRandomJoke({
      'exclude_tags': ['dirty', 'racist'] // Exclude jokes with tags 'dirty' and 'racist'
    });

    // Create an embed to display the joke
    const embed = new EmbedBuilder()
      .setColor('#79e1ea')
      .setTitle(`Random Joke`)
      .addFields({ name: ' ', value: `${getRandomJoke.body}` }) // Add the joke body to the embed
      .setTimestamp();

    try {
      // Reply to the user with the joke embedded
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