const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
// Create a new Discord.js Client instance with the specified intents (Guilds)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {
    // Destructure the guild object from the interaction
    const { guild } = interaction;

    // Create an EmbedBuilder instance to build the response embed
    const embed = new EmbedBuilder()
      .setColor('#ffd86e')
      .setTitle('Ping')
      .setThumbnail(guild.iconURL({ dynamic: true })) // Set the server's icon as the thumbnail
      .addFields(
        { name: `Server Latency`, value: `Latency is ${Date.now() - interaction.createdTimestamp}ms.` }, // Calculate the server latency
        { name: '\u200B', value: '\u200B' }, // Empty field for spacing
        { name: `API Latency`, value: `Latency is ${Math.round(client.ws.ping)}ms.` }, // Display the client's ping to the API
      )
      .setTimestamp(); // Set the timestamp to the current time

    // Send the reply with the built embed
    await interaction.reply({ embeds: [embed] });
  },
};