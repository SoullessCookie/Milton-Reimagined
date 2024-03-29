const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Events, GatewayIntentBits, Collection, ActivityType, AutoModerationRule, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('level')
    .setDescription('Check the level of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check the level for.')
        .setRequired(true))
    .setDMPermission(false),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const userName = user.username
    const userId = user.id;
    const serverId = interaction.guild.id;

    const db = await connectToDatabase();
    const servers = db.collection('userdata');

    try {
      let server = await servers.findOne({ _id: serverId });
      const userInServer = server?.users?.find(u => u._user === userId);

      if (userInServer) {
        const embed = new EmbedBuilder()
          .setColor('#118c4f')
          .setTitle(`${userName}'s Level`)
          .addFields(
            { name: '**Level**', value: `<a:miltonXP:1146962218118815844>  ${userInServer.Level}`, inline: true },
            { name: '**XP**', value: `<a:miltonXP:1146962218118815844> ${userInServer.XP}`, inline: true },
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new EmbedBuilder()
          .setColor('#118c4f')
          .setTitle(`${userName}'s Level`)
          .addFields(
            { name: '**Level**', value: `<a:miltonXP:1146962218118815844> 1`, inline: true },
            { name: '**XP**', value: `<a:miltonXP:1146962218118815844> 0`, inline: true },
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
        await servers.updateOne(
          { _id: serverId },
          {
            $push: {
              users: {
                _user: userId,
                XP: 5,
                Balance: 0,
                Level: 1,
              },
            },
          }
        );
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