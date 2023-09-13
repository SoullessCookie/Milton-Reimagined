const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { MongoClient } = require('mongodb');

// Create a new Discord.js client with specific intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// MongoDB connection URI, which includes the username and password
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome')
    .setDescription('Set up/Change welcome message settings.')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The new welcome message.')
        .setRequired(true)
        .setMaxLength(250))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel to send welcome messages in')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(interaction) {
    // Create a new MongoDB client
    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
      // Connect to the MongoDB cluster
      await dbClient.connect();
      const db = dbClient.db('discord');
      const servers = db.collection('servers');

      // Get the new welcome message, switch status, and channel from the command options
      const welcomeMessage = interaction.options.getString('message');
      const welcomeCommand = interaction.options.getBoolean('switch');
      const welcomeChannelPre = interaction.options.getChannel('channel');
      const welcomeChannel = welcomeChannelPre.id
      const serverId = interaction.guild.id;

      // Update or insert the welcome message settings for the specific server in the MongoDB collection
      await servers.updateOne(
        { _id: serverId },
        { $set: { welcomeMessage } },
        { upsert: true }
      );
      await servers.updateOne(
        { _id: serverId },
        { $set: { welcomeChannel } },
        { upsert: true }
      );

      // Create an embed to display the updated welcome message settings
      const { guild } = interaction;
      const embed = new EmbedBuilder()
        .setColor(0x26eebf)
        .setTitle(`${guild.name} Welcome Message`)
        .addFields(
          { name: 'Channel', value: `${welcomeChannel}`, inline: true },
          { name: 'Message', value: `${welcomeMessage}`, inline: true },
        )
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setTimestamp();

      // Reply to the interaction with the updated welcome message settings
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    } finally {
      // Close the connection to the MongoDB cluster
      await dbClient.close();
    }
  },
};