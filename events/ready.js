const { Client, Events, GatewayIntentBits, Collection, ActivityType } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    const guildCount = client.guilds.cache.size;

    client.user.setPresence({
      activities: [{ name: `${guildCount} Guilds | /help`, type: ActivityType.Watching }],
      status: 'dnd',
    });
  },
};