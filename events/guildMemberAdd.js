const { Client, Events, GatewayIntentBits, Collection, ActivityType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildModeration, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution] });
const { request } = require('undici');
const { MongoClient } = require('mongodb');
const canvafy = require("canvafy");


const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;


module.exports = {
  name: Events.GuildMemberAdd,
  async execute(guildMemberAdd) {
    const { guild, user } = guildMemberAdd;
    const serverId = guild.id

    const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await dbClient.connect();
    const db = dbClient.db('discord');
    const servers = db.collection('servers');
    const userdata = db.collection('userdata');

    const avatarURL = user.displayAvatarURL({ format: 'jpg', dynamic: true }); // Get the avatar URL
    const avatarUrlObj = new URL(avatarURL); // Convert the URL string to a URL object

    try {
      const serverData = await servers.findOne({ _id: serverId });
      const welcome = serverData.welcome;
      if (welcome === true) {
        // Using undici to make HTTP requests for better performance
        const { body } = await request(avatarUrlObj);

        const rulesChannel = serverData.rulesChannel;
        const welcomeChannel = serverData.welcomeChannel;


        const welcome = await new canvafy.WelcomeLeave()
          .setAvatar(user.displayAvatarURL({ format: 'jpg', dynamic: false }))
          .setBackground("image", "https://i.imgur.com/0MejY2R.jpg")
          .setTitle(`Welcome!`)
          .setDescription(` ${user.username} is member #${guild.memberCount}`)
          .setBorder("#2a2e35")
          .setAvatarBorder("#2a2e35")
          .setOverlayOpacity(0.3)
          .build();

        // Check if rulesChannel is defined in the serverData
        if (serverData.rulesChannel === "") {
          let welcomeMessage = serverData.welcomeMessage.replace('{user}', `**<@${user.id}>**`).replace('{server}', `**${guild.name}**`);
          client.channels.fetch(welcomeChannel)
            .then(channel => channel.send({ content: welcomeMessage, files: [{ attachment: welcome, name: `welcome-${user.id}.png` }] }));
        } else {
          let welcomeMessage = serverData.welcomeMessage.replace('{user}', `**<@${user.id}>**`).replace('{server}', `**${guild.name}**`, '{rules}', `**<#${rulesChannel}>**`);
          client.channels.fetch(welcomeChannel)
            .then(channel => channel.send({ content: welcomeMessage, files: [{ attachment: welcome, name: `welcome-${user.id}.png` }] }));
        }
      } else {
        return;
      }
    } catch (error) {
      console.error('Error sending embed:', error);
    }
  },
};

client.login(process.env.token);