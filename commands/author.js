const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

// Import the `setTimeout` function from the Node.js built-in `timers/promises` module
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('author')
    .setDescription('About the author/developers')
    .setDMPermission(false),
  async execute(interaction) {

    // Create an embed to display information about the author/developers
    const embed = new EmbedBuilder()
      .setColor('#ddff57')
      .setTitle('About the Author')
      .addFields(
        { name: 'Developers', value: `SoullessCookie and RoseyNose` },
        { name: 'Github', value: `https://github.com/SoullessCookie/Milton-Reimagined` },
        { name: 'Creation Date', value: `March 9th 2023` },
        { name: 'Language', value: `English` },
        { name: 'Coding Library', value: `Discord.js` },
        { name: 'Created Using', value: `Black Magic` },
      )
      .setThumbnail('https://imgur.com/KthB9H3')
      .setTimestamp();

    try {
      // Send the embed as a reply to the user who invoked the command
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