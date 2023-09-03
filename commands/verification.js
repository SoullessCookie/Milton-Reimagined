const { SlashCommandBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions] });
const { MongoClient } = require('mongodb');
const wait = require('node:timers/promises').setTimeout;

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verification')
    .setDescription('Send a message that allows members to verify.')
    .addStringOption(option =>
      option.setName('verification-message')
        .setDescription('The verification message.')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('verification-channel')
        .setDescription('The channel to send in.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
    .addRoleOption(option =>
      option.setName('verified-role')
        .setDescription('The role to give users once verified.')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('rules-channel')
        .setDescription('The rules channel.')
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {

    const { guild } = interaction;

    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await dbClient.connect();
    const db = dbClient.db('discord');
    const servers = db.collection('servers');

    try {

      const verificationMessage = interaction.options.getString('verification-message');
      const verificationChannel = interaction.options.getChannel('verification-channel').id;
      const verificationRole = interaction.options.getRole('verified-role').id;
      const rulesChannelInput = interaction.options.getChannel('rules-channel');
      const serverId = guild.id;

      if (rulesChannelInput) {
        const rulesChannel = rulesChannelInput.id;
        await servers.updateOne(
          { _id: serverId },
          { $set: { rulesChannel } },
          { upsert: true }
        );
      }
      await servers.updateOne(
        { _id: serverId },
        { $set: { verificationRole } },
        { upsert: true }
      );
      await servers.updateOne(
        { _id: serverId },
        { $set: { verificationMessage } },
        { upsert: true }
      );
      await servers.updateOne(
        { _id: serverId },
        { $set: { verificationChannel } },
        { upsert: true }
      );

      const serverData = await servers.findOne({ _id: serverId });
      const verificationRoleFinal = serverData.verificationRole;
      const verificationMessageFinal = serverData.verificationMessage;
      const verificationChannelFinal = serverData.verificationChannel;
      const rulesChannelFinal = serverData.rulesChannel;


      const embed = new EmbedBuilder()
        .setColor(`#2f3136`)
        .setTitle('**Verification:**')
        .setDescription(`${verificationMessageFinal}`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .addFields(
          { name: `Rules:`, value: `<#${rulesChannelFinal}>`, inline: true },
          { name: `To verify:`, value: `React with- <:miltonAccept:1147691078628155453>` },
        );

      const confirm = new ButtonBuilder()
        .setCustomId('accept-verify-button')
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)
        .setEmoji(':miltonAccept:1147691078628155453');

      const row = new ActionRowBuilder()
        .addComponents(confirm);

      const verifyChannelSend = interaction.client.channels.cache.get(verificationChannelFinal);
      verifyChannelSend.send({ embeds: [embed], components: [row], });

      await interaction.deferReply();
      await wait(100);
      await interaction.editReply({ content: 'Verification Message sent', ephemeral: true });

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