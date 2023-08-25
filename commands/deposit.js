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
    .setName('bank')
    .setDescription('Access your bank')
    .addSubcommand(subcommand =>
      subcommand
        .setName('deposit')
        .setDescription('Deposit money into your bank account.')
        .addStringOption(option => option.setName('amount').setDescription('Amount to deposit. (Cannot be more than your current balance.)')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('withdraw')
        .setDescription('Withdraw money from your bank account.')
        .addStringOption(option => option.setName('amount').setDescription('Amount to withdraw. (Cannot be more than your current bank balance.)')))
    .addSubcommand(subcommand =>
      subcommand
        .setName('balance')
        .setDescription('Check the balance of your bank account.')),

  async execute(interaction) {
    const userId = interaction.user.id;
    const serverId = interaction.guild.id;

    const db = await connectToDatabase();
    const servers = db.collection('userdata');
    const bank = db.collection('userdata');


    try {
      let server = await bank.findOne({ _id: userId });
      const userInServer = server?.users?.find(u => u._user === userId);

      if (interaction.options.getSubcommand() === 'deposit') {
        if (userInServer) {
          await interaction.reply(`Depositing: ${userInServer.bankBalance} into your bank account!`);
        } else {
          await interaction.reply(`No bank account detected, setting up!`);
          await servers.insertOne({ _id: userId, bankBalance: 0 });
        }
      } else if (interaction.options.getSubcommand() === 'withdraw') {
        if (userInServer) {
          await interaction.reply(`Withdrawing: ${userInServer.bankBalance} from your bank account!`);
        } else {
          await interaction.reply(`No bank account detected, setting up!`);
          await servers.insertOne({ _id: userId, bankBalance: 0 });
        }
      } else if (interaction.options.getSubcommand() === 'balance') {
        if (userInServer) {
          await interaction.reply(`You have $${userInServer.bankBalance} in your bank account.`);
        } else {
          await interaction.reply(`No bank account detected, setting up!`);
          await servers.insertOne({ _id: userId, bankBalance: 0 });
        }
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