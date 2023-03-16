const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const getInsult = require("insults").default;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insults a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to insult')
        .setRequired(true)),
  async execute(interaction) {
    const targetUser = interaction.options.getUser('user');
    const randomInsultPack = getInsult()

    try {
      await interaction.reply({ content: `${targetUser}, ${randomInsultPack}`, ephemeral: false });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'An error occurred', ephemeral: true });
    }

  },
};