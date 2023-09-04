const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: `${process.env.bugWebhook}` });


module.exports = {
  data: new SlashCommandBuilder()
    .setName('issue')
    .setDescription('Allows you to report any issues with milton.')
    .addStringOption(option =>
      option.setName('issuetype')
        .setDescription('The type of issue to report')
        .setRequired(true)
        .addChoices(
          { name: 'Bug', value: 'typeBug' },
          { name: 'Error', value: 'typeError' },
          { name: 'Bot Offline', value: 'typeOffline' },
          { name: 'Other', value: 'typeOther' },
        ))
    .setDMPermission(false),

  async execute(interaction) {

    const issueTypeOption = interaction.options && interaction.options.getString('issuetype');

    let embedColor = '#2f3136';
    let issueType = 'Other';

    if (issueTypeOption === 'typeBug') {
      embedColor = '#FFAC1C';
      issueType = 'Bug';
    } else if (issueTypeOption === 'typeError') {
      embedColor = '#EE4B2B';
      issueType = 'Error';
    } else if (issueTypeOption === 'typeOffline') {
      embedColor = '#CF9FFF';
      issueType = 'Bot Offline';
    } else if (issueTypeOption === 'typeOther') {
      embedColor = '#F5F5DC';
      issueType = 'Other';
    }

    module.exports = {
      embedColor,
      issueType,
    };

    const modal = new ModalBuilder()
      .setCustomId('bugModal')
      .setTitle('Milton Bug Report')


    guildId = interaction.guild.id;
    user = interaction.user;
    userId = user.id;

    const setGuildId = new TextInputBuilder()
      .setCustomId('setGuildId')
      .setLabel("Server ID of where the issue occured")
      .setPlaceholder('Use /server to get ID')
      .setValue(`${guildId}`)
      .setRequired(false)
      .setStyle(TextInputStyle.Short);

    const issueDescription = new TextInputBuilder()
      .setCustomId('issueDescription')
      .setLabel("Describe the issue.")
      .setPlaceholder('Description of the issue:')
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);


    const secondRow = new ActionRowBuilder().addComponents(setGuildId);
    const thirdRow = new ActionRowBuilder().addComponents(issueDescription);

    modal.addComponents(secondRow, thirdRow);

    try {
      await interaction.showModal(modal);
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