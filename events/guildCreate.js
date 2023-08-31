const { Client, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient } = require('mongodb');
const chalk = require('chalk');
const serverJoin = chalk.whiteBright.bgMagenta.bold;

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

    const guild = guildCreate;
    const serverId = guild.id;
    const serverName = guild.name;
    const memberCount = guild.memberCount;
    const rulesChannel = guild.rulesChannelId;

    const db = await connectToDatabase();
    const servers = await db.collection('servers');

    // Check if the server already exists in the database
    const existingServer = await servers.findOne({ _id: serverId });
    if (existingServer) {
      console.log(serverJoin(`Joined Server`) + ` Existing ID: ${serverId}`);
      return;
    }

    const settings = {
      serverName: `${serverName}`,
      premiumStatus: false,
      rulesChannel: `${rulesChannel}`,
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
      console.log(serverJoin(`Joined Server`) + ` Added ID: ${serverId}`);
    } catch (error) {
      console.log(chalk.whiteBright.bgRed.underline('ERROR'));
      console.log(`Error adding server with ID ${serverId} to the database:`, error.message);

      const logChannel = interaction.client.channels.cache.get('1133160906361147517');
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      return;
    }
  },
};