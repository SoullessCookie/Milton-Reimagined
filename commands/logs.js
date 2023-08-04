const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');

// Create a new Discord.js client with specific intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// MongoDB connection URI, which includes the username and password
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('logs')
    .setDescription('Toggles event logging on/off')
    .addBooleanOption(option =>
      option.setName('switch')
        .setDescription('False = off')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('log-channel')
        .setDescription('Channel to send logged events to')
        .setRequired(true)),
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

      // Check if user has permission to use the command
      if (!interaction.member.permissions.has(['ADMINISTRATOR', 'MANAGE_GUILD', 'OWNER'])) {
        return await interaction.reply('You do not have permission to use this command.');
      }

      const logging = interaction.options.getBoolean('switch');
      const logChannel = interaction.options.getString('log-channel');



      if (logging === true) {

        await servers.updateOne({ _id: serverId }, { $set: { logging } });
        await servers.updateOne({ _id: serverId }, { $set: { logChannel } });
        await interaction.reply({ content: `Updated event logging in the channel: <#${logChannel}>`, ephemeral: true });
      }
      if (logging === false) {
        await servers.updateOne({ _id: serverId }, { $set: { logging } });
        await servers.updateOne({ _id: serverId }, { $set: { logChannel } });
        await interaction.reply({ content: 'Disabled event logging.', ephemeral: true });
      }
    } catch (error) {
      console.log(error);
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