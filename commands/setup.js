const { Client, GatewayIntentBits, PermissionFlagsBits } = require('discord.js');
const { MongoClient } = require('mongodb');
const { SlashCommandBuilder } = require('@discordjs/builders');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Initial setup for milton')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction) {
    const serverId = interaction.guildId;
    const serverName = interaction.guild.name;
    const memberCount = interaction.guild.memberCount;

    const db = await connectToDatabase();
    const servers = db.collection('servers');

    // Check if the server already exists in the database
    const existingServer = await servers.findOne({ _id: serverId });
    if (existingServer) {
      await interaction.reply('Server setup has already been completed.');
      return;
    }

    const settings = {
      serverName: serverName,
      premiumStatus: false,
      logging: true,
      logChannel: '',
      leveling: true,
      levelingChannel: '',
      disabledChannelsLeveling: '',
      welcome: true,
      welcomeMessage: '',
      inviteTrack: true,
      economy: true,
      automod: true,
      moderationCommands: true,
      funCommands: true,
      musicFeature: true,
    };

    // Insert the new server data into the database
    try {
      await servers.insertOne({ _id: serverId, ...settings });
      await interaction.reply('Server setup completed successfully.');
    } catch (error) {
      console.log(`Error adding server with ID ${serverId} to the database:`, error.message);

      const logChannel = client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while setting up the server.', ephemeral: true });
    }
  }
};