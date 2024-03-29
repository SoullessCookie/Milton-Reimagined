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
        console.log(error);

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
          const { embedColor, issueType } = require('../commands/bug.js');
          guildId = interaction.guild.id;
          user = interaction.user;
          userId = user.id;
          const guildIdResponse = interaction.fields.getTextInputValue('setGuildId');
          const issueDescriptionReponse = interaction.fields.getTextInputValue('issueDescription')

          const botdata = db.collection('botdata');
          const botDataDocument = await botdata.findOne({ _id: 1 });

          if (!botDataDocument) {
            await botdata.insertOne({ _id: 1, errorCount: 1 });
          } else {
            const newErrorCount = (botDataDocument.errorCount || 0) + 1;
            await botdata.updateOne({ _id: 1 }, { $set: { errorCount: newErrorCount } });
          }

          const checkmarkImage = 'https://i.imgur.com/wULHOf0.png';
          const xImage = 'https://i.imgur.com/a63Py6u.png';
          const embedColorFinal = embedColor;
          const issueTypeFinal = issueType;

          const embed = new EmbedBuilder()
            .setColor(embedColorFinal)
            .setAuthor({ name: `Issue #${botDataDocument.errorCount}` })
            .setTitle(`(Open) ${issueTypeFinal}`)
            .setThumbnail(xImage)
            .addFields(
              { name: `**Issue Description**`, value: `${issueDescriptionReponse}` },
              { name: `**Guild Id**`, value: `${guildIdResponse || guildId}` },
              { name: `**User Id**`, value: `${userId}` },
            )
            .setTimestamp();

          webhookClient.send({
            embeds: [embed],
          });
          await interaction.reply({ content: 'Thanks for submitting a report! We will do our best to fix your issue ASAP.', ephemeral: true });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};