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
    .setName('withdraw')
    .setDescription('Withdraw money from your bank to your Wallet')
    .addNumberOption(option =>
      option.setName('amount')
        .setDescription('Amount to withdraw.')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;
    const amount = interaction.options.getNumber('amount');

    const db = await connectToDatabase();
    const userdata = db.collection('userdata');


    try {
      let server = await userdata.findOne({ _id: serverId });
      const userIndex = server?.users?.findIndex((user) => user._user === userId);

      if (userIndex !== -1) {
        const currentBank = server.users[userIndex].Bank
        const currentWallet = server.users[userIndex].Wallet

        if (amount > currentBank) {
          await interaction.reply({ content: `You can't withdraw more than what is currently in your bank: <a:miltonStud:1144482317499375786>${currentBank}`, ephemeral: true });
        } else {
          await userdata.updateOne(
            { _id: serverId, "users._user": userId },
            { $inc: { "users.$.Bank": -amount, "users.$.Wallet": amount } },
          );
          await interaction.reply(`Withdrew: <a:miltonStud:1144482317499375786>${amount}`);
        }

      } else {
        await interaction.reply(`You havent set up banking yet. Please send a message in the server first. <a:miltonPepeRich:1144487645783801866>`);
      }
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