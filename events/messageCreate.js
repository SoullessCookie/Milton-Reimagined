const { Client, Events, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return; // Ignore messages from bots

    const userId = message.author.id;
    const userJoinAt = message.author.joinedAt
    const serverId = message.guild.id;
    const channelId = message.channel.id;

    const db = await connectToDatabase();
    const servers = db.collection('userdata');

    try {
      // Fetch the server data from the database
      let server = await servers.findOne({ _id: serverId });

      if (!server) {
        // Server document doesn't exist, create a new one with the users field
        await servers.insertOne({
          _id: serverId,
          users: [],
        });

        // Now fetch the server data again with the users field initialized
        server = await servers.findOne({ _id: serverId });
      }

      if (server.disabledChannelsLeveling?.includes(channelId)) {
        // The current channel is in the disabledChannelsLeveling list, do not update XP
        return;
      }

      // Find the user in the server's user array
      const userIndex = server?.users?.findIndex((user) => user._user === userId);

      if (userIndex !== -1) {
        // User exists in the server's user array, so update the XP
        const newXp = (server.users[userIndex].XP || 0) + 5; // Increment XP by 5, default to 0 if user doesn't have an XP field

        // Update the user's XP in the database
        await servers.updateOne(
          { _id: serverId, "users._user": userId },
          {
            $set: {
              "users.$.XP": newXp,
            },
          }
        );
      } else {
        // User doesn't exist in the server's user array, so add a new entry for the user
        await servers.updateOne(
          { _id: serverId },
          {
            $push: {
              users: {
                _user: userId,
                XP: 5,
                Bank: 0,
                Wallet: 0,
                Level: 1,
                Invites: 0,
                JoinDate: userJoinAt,
              },
            },
          }
        );
      }
    } catch (error) {
      console.log(`Error updating user xp:`, error.message);

      const logChannel = client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Event: ${Events.MessageCreate}\nUser: ${message.author.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
    } finally {
      
    }
  },
};

client.login(process.env.token);