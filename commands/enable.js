const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { MongoClient } = require('mongodb');

// Create a new Discord.js client with specific intents
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

// This is just a blank command for use later because why not?
module.exports = {
  data: new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables a feature')
    .addStringOption(option =>
      option.setName('feature')
        .setDescription('The feature to enable')
        .setRequired(true)
        .addChoices(
          { name: 'Logging', value: 'enableLogging' },
          { name: 'Leveling', value: 'enableLeveling' },
          { name: 'Invite Tracking', value: 'enableInviteTrack' },
          { name: 'Economy', value: 'enableEconomy' },
          { name: 'Automod', value: 'enableAutomod' },
          { name: 'Moderation Commands', value: 'enableModerationCommands' },
          { name: 'Fun Commands', value: 'enableFunCommands' },
          { name: 'Music Player', value: 'enableMusicFeature' },
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction) {
    const db = await connectToDatabase();
    const servers = db.collection('servers');
    const feature = interaction.options.getString('feature');
    const serverId = interaction.guildId;

    const logging = true
    const leveling = true
    const inviteTrack = true
    const economy = true
    const automod = true
    const moderationCommands = true
    const funCommands = true
    const musicFeature = true

    try {
      if (feature === 'enableLogging') {
        await servers.updateOne({ _id: serverId }, { $set: { logging } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableLeveling') {
        await servers.updateOne({ _id: serverId }, { $set: { leveling } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableInviteTrack') {
        await servers.updateOne({ _id: serverId }, { $set: { inviteTrack } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableEconomy') {
        await servers.updateOne({ _id: serverId }, { $set: { economy } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableAutomod') {
        await servers.updateOne({ _id: serverId }, { $set: { automod } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableModerationCommands') {
        await servers.updateOne({ _id: serverId }, { $set: { moderationCommands } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableFunCommands') {
        await servers.updateOne({ _id: serverId }, { $set: { funCommands } });
        await interaction.reply(`Enabled feature: ${feature}`);

      } else if (feature === 'enableMusicFeature') {
        await servers.updateOne({ _id: serverId }, { $set: { musicFeature } });
        await interaction.reply(`Enabled feature: ${feature}`);
      }


    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};