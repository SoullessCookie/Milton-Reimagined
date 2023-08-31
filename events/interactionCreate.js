const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const fs = require('node:fs');
const chalk = require('chalk');
const interactionCreated = chalk.whiteBright.bgMagenta.bold;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    const db = await connectToDatabase();
    const botdata = db.collection('botdata');
    const botDataDocument = await botdata.findOne({ _id: 1 });

    if (!botDataDocument) {
      await botdata.insertOne({ _id: 1, commandCount: 1 });
    } else {
      const newCommandCount = (botDataDocument.commandCount || 0) + 1;
      await botdata.updateOne({ _id: 1 }, { $set: { commandCount: newCommandCount } });
    }


    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.log(chalk.whiteBright.bgRed.underline('ERROR'));
      console.log(`Error Running Command:`, error.message);

      const logChannel = client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Event: ${Events.InteractionCreate}\nCommand: ${command}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
    } finally {

    }
  },
};