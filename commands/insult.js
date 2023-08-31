const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, PermissionFlagsBits } = require('discord.js');
const getInsult = require("insults").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insults a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to insult')
        .setRequired(true))
    .setDMPermission(false),
  async execute(interaction) {
    // Get the targeted user from the slash command option
    const targetUser = interaction.options.getUser('user');

    // Generate a random insult using the insults library
    const randomInsultPack = getInsult();

    try {
      // Reply to the user with the insult directed at the targeted user
      await interaction.reply({ content: `${targetUser}, ${randomInsultPack}`, ephemeral: false });
    } catch (error) {
      const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
      if (logChannel) {
        logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
      }
      await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
    }
  },
};