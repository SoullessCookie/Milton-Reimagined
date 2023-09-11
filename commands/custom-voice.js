const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custom-voice')
    .setDescription('Creates a "join to create custom" voice channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels | PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),

  async execute(interaction) {
    const serverId = interaction.guild.id;
    const guild = interaction.guild;
    const userId = interaction.member.user.id;

    const db = await connectToDatabase();
    const servers = db.collection('servers');
    const serverdata = await servers.findOne({ _id: serverId });

    try {
      const CreateChannel = guild.channels.create(
        {
          name: "Join to Create",
          type: ChannelType.GuildVoice,
        }
      ).then(result => {
        customVoiceId = result.id;
        servers.updateOne(
          { _id: serverId },
          { $set: { customVoiceId } },
          { upsert: true }
        );
        interaction.reply(`Created voice channel: <#${customVoiceId}>`);
      });
    } catch (error) {
      console.log(error);
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};