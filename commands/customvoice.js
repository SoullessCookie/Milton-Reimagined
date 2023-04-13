const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('customvoice')
    .setDescription('Toggle custom voice channel creation on and off for your server.')
    .addBooleanOption(option =>
      option.setName('switch')
        .setDescription('Turn command on/off')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Select the channel where custom voice channels will be created.')
        .setRequired(true)),
  async execute(interaction) {
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      // Connect to the MongoDB cluster
      await dbClient.connect();
      const db = dbClient.db('discord');
      const servers = db.collection('servers');

      // Check if user has permission to use the command
      if (!interaction.member.permissions.has(['ADMINISTRATOR', 'MANAGE_GUILD', 'OWNER'])) {
        return await interaction.reply('You do not have permission to use this command.');
      }

      const customVoice = interaction.options.getBoolean('switch');
      const customVoiceChannel = interaction.options.getChannel('channel');

      await servers.updateOne(
        { _id: interaction.guildId },
        { $set: { customVoice, customVoiceChannel: customVoiceChannel.id } },
        { upsert: true }
      );

      const { guild } = interaction;
      const embed = new EmbedBuilder()
        .setColor(0x26eebf)
        .setTitle(`${guild.name} Custom Voice Channel`)
        .addFields(
          { name: 'Status', value: `${customVoice}`, inline: true },
          { name: 'Channel', value: `${customVoiceChannel}`, inline: true },
        )
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp()

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply({ content: 'An error occurred while trying to switch custom voice channel', ephemeral: true });
    } finally {
      // Close the connection to the MongoDB cluster
      await dbClient.close();
    }
  },
};