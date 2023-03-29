const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const { token } = require('./config.json');
const { exec } = require('child_process');
const { pm2 } = require('pm2');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

// Load the current counter value from the data file
let counterData = fs.readFileSync('./data.json');
let counter = JSON.parse(counterData).counter || 0;

client.on('ready', async () => {
  console.log(`Ready! Logged in as ${client.user.tag}`);

  const guildCount = client.guilds.cache.size;

  client.user.setPresence({
    activities: [{ name: `${guildCount} Guilds | ${counter} commands used`, type: ActivityType.Watching }],
    status: 'dnd',
  });
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  const db = await connectToDatabase();
  const servers = await connectToDatabase().then(db => db.collection('servers'));
  const serverId = interaction.guild.id;
  const settings = {
    serverName: `${interaction.guild.name}`,
  };
  await servers.updateOne({ _id: serverId }, { $set: settings }, { upsert: true });

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  counter++;
  fs.writeFileSync('./data.json', JSON.stringify({ counter }));

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

  // Update the bot's status with the new counter value
  const guildCount = client.guilds.cache.size;

  client.user.setPresence({
    activities: [{ name: `${guildCount} Guilds | ${counter} Commands used`, type: ActivityType.Watching }],
    status: 'dnd',
  });
});

exec('node deploy-commands.js', (error) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
});

client.on('guildMemberAdd', async (member) => {
  // Retrieve the server settings from the database
  const serverSettings = await servers.findOne({ _id: member.guild.id });

  // Check if welcome command is enabled for the server
  if (!serverSettings || !serverSettings.welcomeCommand) return;

  // Get the ID of the welcome channel
  const channelId = serverSettings.welcomeChannel;

  // Find the welcome channel by ID in the server
  const channel = member.guild.channels.cache.get(channelId);

  // Check if the welcome channel exists
  if (!channel) return;

  // Get the welcome message from the server settings and replace the user placeholder with the user's name
  const welcomeMessage = serverSettings.welcomeMessage.replace('{user}', `<@${member.id}>`);

  // Send the welcome message to the welcome channel
  channel.send(welcomeMessage);
  console.log(welcomeMessage);
});


client.login(process.env.token);