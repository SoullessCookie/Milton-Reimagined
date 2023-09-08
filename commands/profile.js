const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
// Create a new Discord.js Client instance with the specified intents (Guilds)
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profiled')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {

    try {
      // Destructure the guild object from the interaction
      const { guild } = interaction;

      // Create an EmbedBuilder instance to build the response embed
      const embed = new EmbedBuilder()
        .setColor('#ffd86e')
        .setTitle('Ping')
        .setThumbnail(guild.iconURL({ dynamic: true })) // Set the server's icon as the thumbnail
        .addFields(
          { name: `Server Latency: `, value: `${Date.now() - interaction.createdTimestamp}ms.` }, // Calculate the server latency
          { name: `Websocket: `, value: `${client.ws.ping}ms.` },
        )
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