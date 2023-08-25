const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Events, GatewayIntentBits, Collection, ActivityType, AutoModerationRule, EmbedBuilder } = require('discord.js');
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
    .setName('balance')
    .setDescription('Check the balance of a user.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check the balance of.')
        .setRequired(true)),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const userName = user.displayName
    const userId = user.id;
    const userAvatar = user.displayAvatarURL;
    const serverId = interaction.guild.id;

    const db = await connectToDatabase();
    const servers = db.collection('userdata');

    try {
      let server = await servers.findOne({ _id: serverId });
      const userInServer = server?.users?.find(u => u._user === userId);

      if (userInServer) {

        netWorth = userInServer.Bank + userInServer.Wallet

        const embed = new EmbedBuilder()
          .setColor('#118c4f')
          .setTitle(`${userName}'s Balance`)
          .addFields(
            { name: '**Wallet**', value: `<a:miltonStud:1144482317499375786> ${userInServer.Wallet}`, inline: true },
            { name: '**Bank**', value: `<a:miltonStud:1144482317499375786> ${userInServer.Bank}`, inline: true },
            { name: '**Net Worth**', value: `<a:miltonStud:1144482317499375786> ${netWorth}`, inline: true },
          )
          .setThumbnail(user.displayAvatarURL({ dynamic: true }))
          .setTimestamp();

        await interaction.reply({ embeds: [embed] });
      } else {
        await interaction.reply(`${userName} hasn't set up banking yet. Ask them to send a message first <a:miltonPepeRich:1144487645783801866>`);
      }
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        console.log(error);
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};