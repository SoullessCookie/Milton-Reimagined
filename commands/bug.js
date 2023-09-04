const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, Events, ModalBuilder, TextInputBuilder, TextInputStyle, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: `${process.env.bugWebhook}` });


module.exports = {
  data: new SlashCommandBuilder()
    .setName('bug')
    .setDescription('Allows you to report any bugs with milton.'),

  async execute(interaction) {

    const modal = new ModalBuilder()
      .setCustomId('bugModal')
      .setTitle('Milton Bug Report')


    guildId = interaction.guild.id;
    user = interaction.user;
    userId = user.id;

    const issueType = new TextInputBuilder()
      .setCustomId('issueType')
      .setLabel("What's the issue type?")
      .setMinLength(3)
      .setPlaceholder('Bug/Error/Offline/etc')
      .setRequired(true)
      .setStyle(TextInputStyle.Short);

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


    const firstRow = new ActionRowBuilder().addComponents(issueType);
    const secondRow = new ActionRowBuilder().addComponents(setGuildId);
    const thirdRow = new ActionRowBuilder().addComponents(issueDescription);

    modal.addComponents(firstRow, secondRow, thirdRow);

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