const { Client, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

const userCooldowns = {}; // This object will store user cooldown timestamps

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return; // Ignore messages from bots

    const userId = message.author.id;
    const serverId = message.guild.id;
    const channelId = message.channel.id;

    const db = await connectToDatabase();
    const userdata = db.collection('userdata');

    const servers = db.collection('servers');
    const serverdata = await servers.findOne({ _id: serverId });
    const disabledChannelsLeveling = serverdata?.disabledChannelsLeveling || [];




    try {
      // Fetch the server data from the database
      let server = await userdata.findOne({ _id: serverId });

      if (!server) {
        // Server document doesn't exist, create a new one with the users field
        await userdata.insertOne({
          _id: serverId,
          users: [],
        });

        // Now fetch the server data again with the users field initialized
        server = await userdata.findOne({ _id: serverId });
      }

      if (server.disabledChannelsLeveling?.includes(channelId)) {
        // The current channel is in the disabledChannelsLeveling list, do not update XP
        return;
      }

      // Check if the user is on cooldown
      const now = Date.now();
      if (!userCooldowns[userId] || now - userCooldowns[userId] >= 60000) { // 60000 milliseconds = 1 minute
        // Calculate the random XP earned per message
        const minXPPerMessage = 15;
        const maxXPPerMessage = 25;
        const earnedXP = Math.floor(Math.random() * (maxXPPerMessage - minXPPerMessage + 1)) + minXPPerMessage;

        // Find the user in the server's user array
        const userIndex = server?.users?.findIndex((user) => user._user === userId);

        if (userIndex !== -1) {
          const index = disabledChannelsLeveling.indexOf(channelId);

          if (index !== -1) {
            console.log("Leveling is disabled in this channel")
          } else {
            // User exists in the server's user array, so update the XP
            const newXp = (server.users[userIndex].XP || 0) + earnedXP;

            // Update the user's XP in the database
            await userdata.updateOne(
              { _id: serverId, "users._user": userId },
              {
                $set: {
                  "users.$.XP": newXp,
                },
              }
            );

            userCooldowns[userId] = now;
          }
        } else {
          // User doesn't exist in the server's user array, so add a new entry for the user
          await userdata.updateOne(
            { _id: serverId },
            {
              $push: {
                users: {
                  _user: userId,
                  XP: earnedXP,
                  Bank: 0,
                  Wallet: 0,
                  Level: 1,
                  Invites: 0,
                  Rep: 0,
                  About: 'Nothing here yet!',
                  Strikes: 0,
                },
              },
            }
          );
        }
      } else {
        // User is on cooldown
      }
    } catch (error) {
      console.log(chalk.whiteBright.bgRed.underline('ERROR'));
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