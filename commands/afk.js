const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

// Create a Map to store the AFK users and their reasons
const afkUsers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Sets you as afk')
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('AFK Reason')
        .setRequired(false)),

  async execute(interaction) {
    const user = interaction.user;
    const reason = interaction.options.getString('reason') || 'No reason provided';

    // Set the user as AFK in the Map
    afkUsers.set(user.id, reason);

    // Send a confirmation message
    await interaction.reply(`You are now AFK for the following reason: ${reason}`);

    // Listen for mentions of the AFK user
    const listener = interaction.client.on('messageCreate', message => {
      if (message.author.bot) return; // Ignore messages from bots
      if (!message.mentions.has(user)) return; // Ignore messages that don't mention the AFK user

      // Send a message saying the user is AFK
      const embed = new MessageEmbed()
        .setColor('#FFC0CB')
        .setDescription(`${user.username} is AFK for the following reason: ${reason}`)
      message.channel.send({ embeds: [embed] });

      // Remove the listener to prevent it from triggering again
      listener.off('messageCreate', listener);
    });
  },
};