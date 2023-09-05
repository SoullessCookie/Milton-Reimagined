const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { MongoClient } = require('mongodb');

// Create a new Discord.js client with specific intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// MongoDB connection URI, which includes the username and password
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channel-leveling')
    .setDescription('Toggles leveling in a specific channel on/off.')
    .addBooleanOption(option =>
      option.setName('switch')
        .setDescription('False = off')
        .setRequired(true))
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
      const serverId = interaction.guild.id;
      const server = await servers.findOne({ _id: serverId });
      const disabledChannelsLeveling = server?.disabledChannelsLeveling || [];

      // Get the new welcome message, switch status, and channel from the command options
      const channelId = interaction.channel.id;
      const switchStatus = interaction.options.getBoolean('switch');
      const index = disabledChannelsLeveling.indexOf(channelId);


      if (switchStatus) {
        if (index !== -1) {
          // Remove the channel ID from the disabledChannelsLeveling array
          disabledChannelsLeveling.splice(index, 1);
          await servers.updateOne({ _id: serverId }, { $set: { disabledChannelsLeveling } });
          await interaction.reply({ content: 'Enabled leveling in this channel.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Leveling is already enabled in this channel.', ephemeral: true });
        }
      } else {
        // If the user wants to disable experience earning in this channel
        if (index === -1) {
          // Add the channel ID to the disabledChannelsLeveling array
          disabledChannelsLeveling.push(channelId);
          await servers.updateOne({ _id: serverId }, { $set: { disabledChannelsLeveling } });
          await interaction.reply({ content: 'Disabled leveling in this channel.', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Leveling is already disabled in this channel.', ephemeral: true });
        }
      }
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
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