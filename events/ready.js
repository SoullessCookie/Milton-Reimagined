const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');
const chalk = require('chalk');
const serverJoin = chalk.whiteBright.bgMagenta.bold;

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(chalk.bgCyanBright.bold(`Ready!`) + ` Logged in as ${client.user.tag}`);

    const guildCount = client.guilds.cache.size;

    client.user.setPresence({
      activities: [{ name: `${guildCount} Guilds | /help`, type: ActivityType.Watching }],
      status: 'dnd',
    });
  },
};