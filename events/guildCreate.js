const { Client, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient } = require('mongodb');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  name: Events.GuildCreate,
  async execute(guildCreate) {
    console.log('GuildCreate event received.');
    console.log('guildCreate:', guildCreate);

    const serverId = guild.id;
    const serverName = guild.name;
    const memberCount = guild.memberCount;

    const db = await connectToDatabase();
    const servers = await db.collection('servers');

    // Check if the server already exists in the database
    const existingServer = await servers.findOne({ _id: serverId });
    if (existingServer) {
      console.log(`Server with ID ${serverId} already exists in the database.`);
      return;
    }

    const settings = {
      serverName: `${serverName}`,
      premiumStatus: false,
      logging: true,
      logChannel: ``,
      leveling: true,
      levelingChannel: ``,
      disabledChannelsLeveling: ``,
      welcome: true,
      welcomeMessage: ``,
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
      console.log(`Server with ID ${serverId} added to the database.`);
    } catch (error) {
      console.log(`Error adding server with ID ${serverId} to the database:`, error.message);

      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      return;
    }
  },
};