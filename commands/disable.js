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
    .setName('disable')
    .setDescription('Disables a feature')
    .addStringOption(option =>
      option.setName('feature')
        .setDescription('The feature to disable')
        .setRequired(true)
        .addChoices(
          { name: 'Logging', value: 'disableLogging' },
          { name: 'Leveling', value: 'disableLeveling' },
          { name: 'Invite Tracking', value: 'disableInviteTrack' },
          { name: 'Economy', value: 'disableEconomy' },
          { name: 'Automod', value: 'disableAutomod' },
          { name: 'Moderation Commands', value: 'disableModerationCommands' },
          { name: 'Fun Commands', value: 'disableFunCommands' },
          { name: 'Music Player', value: 'disableMusicFeature' },
        ))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction) {
    const db = await connectToDatabase();
    const servers = db.collection('servers');
    const feature = interaction.options.getString('feature');
    const serverId = interaction.guildId;

    const logging = false
    const leveling = false
    const inviteTrack = false
    const economy = false
    const automod = false
    const moderationCommands = false
    const funCommands = false
    const musicFeature = false

    try {
      if (feature === 'disableLogging') {
        await servers.updateOne({ _id: serverId }, { $set: { logging } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableLeveling') {
        await servers.updateOne({ _id: serverId }, { $set: { leveling } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableInviteTrack') {
        await servers.updateOne({ _id: serverId }, { $set: { inviteTrack } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableEconomy') {
        await servers.updateOne({ _id: serverId }, { $set: { economy } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableAutomod') {
        await servers.updateOne({ _id: serverId }, { $set: { automod } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableModerationCommands') {
        await servers.updateOne({ _id: serverId }, { $set: { moderationCommands } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableFunCommands') {
        await servers.updateOne({ _id: serverId }, { $set: { funCommands } });
        await interaction.reply(`Disabled feature: ${feature}`);

      } else if (feature === 'disableMusicFeature') {
        await servers.updateOne({ _id: serverId }, { $set: { musicFeature } });
        await interaction.reply(`Disabled feature: ${feature}`);
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