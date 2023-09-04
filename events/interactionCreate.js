const { Client, Events, GatewayIntentBits, Collection, ActivityType, WebhookClient, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('node:fs');
const chalk = require('chalk');
const interactionCreated = chalk.whiteBright.bgMagenta.bold;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });

const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const webhookClient = new WebhookClient({ url: `${process.env.bugWebhook}` });

async function connectToDatabase() {
  await mongoClient.connect();
  return mongoClient.db('discord');
}


module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    const db = await connectToDatabase();
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

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
      }
    } else if (interaction.isButton()) {
      const serverId = interaction.guild.id;
      const userId = interaction.member.user.id;
      const buttonId = interaction.customId;
      const servers = db.collection('servers');
      const serverData = await servers.findOne({ _id: serverId });

      if (buttonId == "accept-verify-button") {
        await interaction.reply({ content: 'Verified', ephemeral: true });
        await interaction.deleteReply();
        try {
          const verificationRoleFinal = serverData.verificationRole;
          await interaction.member.roles.add(verificationRoleFinal, `Verified`);
        } catch (error) {
          console.log(error);
          const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
          if (logChannel) {
            logChannel.send(`Event: ${interaction.eventName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
          }
          await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
          await interaction.deleteReply();
        }
      }
    } else if (interaction.isStringSelectMenu()) {
      // Handle string select menu interaction
    } else if (interaction.isModalSubmit()) {
      if (interaction.customId === 'bugModal') {
        try {
          await interaction.reply({ content: 'Thanks for submitting a report! We will do our best to fix your issue ASAP.', ephemeral: true });
          guildId = interaction.guild.id;
          user = interaction.user;
          userId = user.id;
          const issueTypeResponse = interaction.fields.getTextInputValue('issueType');
          const guildIdResponse = interaction.fields.getTextInputValue('setGuildId');
          const issueDescriptionReponse = interaction.fields.getTextInputValue('issueDescription')


          const embed = new EmbedBuilder()
            .setColor('#EE4B2B')
            .setTitle('(Open) Bug Report')
            .setThumbnail(user.avatarURL({ dynamic: true }))
            .addFields(
              { name: `**Issue Type**`, value: `${issueTypeResponse}` },
              { name: `**Issue Description**`, value: `${issueDescriptionReponse}` },
              { name: `**Guild Id**`, value: `${guildIdResponse || guildId}` },
              { name: `**User Id**`, value: `${userId}` },
            )
            .setTimestamp();

          webhookClient.send({
            embeds: [embed],
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};