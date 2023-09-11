const { Client, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });
const chalk = require('chalk');

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) { // Use oldState and newState

    const serverId = newState.guild.id; // Use newState.guild.id
    const userId = oldState.id;
    const channelId = newState.channelId; // Use newState.channelId
    const oldChannelId = oldState.channelId; // Use oldState.channelId
    const username = oldState.member.displayName;

    const db = await connectToDatabase();

    const servers = db.collection('servers');
    const serverData = await servers.findOne({ _id: serverId });

    try {
      if (channelId == serverData.customVoiceId && oldChannelId !== serverData.customVoiceId) {
        console.log(`${username} joined the custom voice channel`);
      }
    } catch (error) {
      console.log(chalk.whiteBright.bgRed.underline('ERROR'));
      console.log(`Error updating voice`, error.message);

      const logChannel = client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Event: ${Events.MessageCreate}\nUser: ${message.author.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
    } finally {

    }
  },
};

client.login(process.env.token);