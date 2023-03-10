const { SlashCommandBuilder } = require('discord.js');
const { dev_ids } = require('./config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Reboots bot. Dev team only!'),
  async execute(interaction) {
    if (interaction.userId == dev_ids) {
      // If the user is the bot owner
      await interaction.reply('Rebooting Milton...');
      exec('pm2 restart index.js', (error) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
      });
    }
    else {
      // If the user is not the bot owner
      return message.reply('You are not authorized to use this command.');
    }

  },
};