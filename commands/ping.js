const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),
  async execute(interaction) {

    const { guild } = interaction;
    const embed = new EmbedBuilder()
      .setColor('#ffd86e')
      .setTitle('Ping')
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: `Server Latency`, value: `Latency is ${Date.now() - interaction.createdTimestamp}ms.` },
        { name: '\u200B', value: '\u200B' },
        { name: `API Latency`, value: `Client ping is ${Math.round(client.ws.ping)}ms.` },
      )
      .setTimestamp()

    await interaction.reply({ embeds: [embed] });
  },
};