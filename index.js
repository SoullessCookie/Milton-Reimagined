const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { exec } = require('child_process');
const { pm2 } = require('pm2');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
let totalUsers = 0;

client.on('ready', async () => {

  console.log(`Ready! Logged in as ${client.user.tag}`);

  const guildCount = client.guilds.cache.size;

  client.user.setPresence({
    activities: [{ name: `${guildCount} Guilds | /help`, type: ActivityType.Watching }],
    status: 'dnd',
  });
})



client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

exec('node deploy-commands.js', (error) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});


const { MongoClient } = require('mongodb');

// Replace the following with your MongoDB connection string
const url = 'mongodb+srv://miltondb.at8jg7u.mongodb.net/MiltonDB';

// Connect to the database
const mongoClient = new MongoClient(url, {
  auth: {
    username: "discordbot",
    password: process.env.mongopass
  }
});
mongoClient.connect();

// Get a reference to the database
const db = mongoClient.db();

// Insert a document into a collection
const collection = db.collection('mycollection');
collection.insertOne({ name: 'John Doe', name: { age: 42 } });

// Find documents in a collection
const documents = collection.find({ age: { $gt: 30 } }).toArray();


client.on('guildCreate', (guild) => {
  console.log(`Joined ${guild.name} (ID: ${guild.id})`);
});

client.login(process.env.token);