const { SlashCommandBuilder } = require('discord.js');
const { dev_ids } = require('./config.json');
const { pm2 } = require('pm2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Reboots bot. Dev team only!'),
  async execute(interaction) {
    await interaction.reply('You are not authorized to use this command.');
  },
};
