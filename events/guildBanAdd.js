const { Client, Events, GatewayIntentBits, EmbedBuilder, WebhookClient } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

async function connectToDatabase() {
  const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
  return mongoClient.db('discord');
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

module.exports = {
  name: Events.GuildBanAdd,
  async execute(guildBanAdd) {
    try {
      const db = await connectToDatabase();
      const servers = db.collection('servers');

      const { user, guild, reason, client } = guildBanAdd;
      const { username, id } = user;
      const { id: guildId } = guild;
      const { username: moderator } = client.user;
      const { id: moderatorId } = client.user;
      const webhookClient = new WebhookClient({ url: `${process.env.webhook}` });

      // Check if the server exists in the database
      const server = await servers.findOne({ _id: guildId });
      if (!server) return;

      const { logging, logChannel } = server;
      if (!logging || !logChannel) return;

      // Create the embed to send the information
      const embed = new EmbedBuilder()
        .setColor(`#2f3136`)
        .setTitle(`${username} has been banned!!`)
        .addFields(
          { name: 'Member:', value: `${username} [${id}]` },
          { name: 'Moderator:', value: `${moderator} [${moderatorId}]` },
          { name: 'Server:', value: `${guild.name}` },
          { name: 'Reason:', value: `${reason || 'No reason given'}` },
        )
        .setThumbnail(user.avatarURL({ dynamic: true }))
        .setTimestamp();

      const channel = await client.channels.fetch(logChannel);
      if (channel) {
        webhookClient.send({
          embeds: [embed],
        });
      } else {
        console.error(`Log channel (${logChannel}) not found.`);
      }
    } catch (error) {
      console.error('Error handling GuildBanAdd event:', error);
    }
  },
};

client.login(process.env.token);