const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// Create a new Discord.js Client instance with the specified intents (Guilds)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Gets you vote link for Milton.'),
  async execute(interaction) {

    try {
      // Destructure the guild object from the interaction
      const { guild } = interaction;


      // Create an EmbedBuilder instance to build the response embed
      const embed = new EmbedBuilder()
        .setColor('#ffd86e')
        .setTitle('Vote for Milton!!')
        .setThumbnail(interaction.client.avatarURL({ dynamic: true })) // Set the Milton's icon as the thumbnail
        .setURL(`https://top.gg/bot/1083500782164389938/vote`)
        .setTimestamp(); // Set the timestamp to the current time

      // Send the reply with the built embed
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