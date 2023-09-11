const { Client, Events, GatewayIntentBits, EmbedBuilder, WebhookClient } = require('discord.js');
const { MongoClient } = require('mongodb');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages] });

const uri = `mongodb+srv://milton:${process.env.mongoToken}@discord.o4bbgom.mongodb.net/?retryWrites=true&w=majority`;

async function connectToDatabase() {
  const mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await mongoClient.connect();
  return mongoClient.db('discord');
}

module.exports = {
  name: Events.GuildMemberUpdate,
  async execute(oldMember, newMember) {
    try {
      const db = await connectToDatabase();
      const servers = db.collection('servers');

      const { user, guild } = newMember;
      const { username, id } = user;
      const { id: guildId } = guild;

      userImage = user.avatarURL
      // Check if the server exists in the database
      const server = await servers.findOne({ _id: guildId });
      if (!server) return;

      const { logging, logChannel } = server;
      if (!logging || !logChannel) return;

      // Fetch roles for old and new members
      const oldRoles = oldMember.roles.cache;
      const newRoles = newMember.roles.cache;

      const checkmarkImage = 'https://i.imgur.com/wULHOf0.png';
      const xImage = 'https://i.imgur.com/a63Py6u.png';

      // Check for role changes
      const addedRoles = newRoles.filter((role) => !oldRoles.has(role.id));
      const removedRoles = oldRoles.filter((role) => !newRoles.has(role.id));

      newRole = addedRoles.map((role) => role.name).join(', ')
      if (addedRoles.size > 0) {
        const embed = new EmbedBuilder()
          .setColor(`#2f3136`)
          .setAuthor({ name: 'Role Applied', iconURL: `${userImage}` })
          .setTitle(`${username} got the ${newRole} role`)
          .setThumbnail(`${xImage}`)
          .addFields(
            { name: 'User', value: `**Name:** ${username} \n **Mention:** <@${id}> \n **ID:** ${id}`, inline: true },
            { name: 'Role', value: `**Name:** ${newRole} \n **Mention:** <@&${newRole.id}> \n **ID:** ${newRole.id}`, inline: true },
          )
          .setTimestamp();
      }

      removedRole = removedRoles.map((role) => role.name).join(', ')
      if (removedRoles.size > 0) {
        const embed = new EmbedBuilder()
          .setColor(`#2f3136`)
          .setAuthor({ name: 'Role Removed', iconURL: `${userImage}` })
          .setTitle(`${username} lost the ${removedRole} role`)
          .setThumbnail(`${xImage}`)
          .addFields(
            { name: 'User', value: `**Name:** ${username} \n **Mention:** <@${id}> \n **ID:** ${id}`, inline: true },
            { name: 'Role', value: `**Name:** ${removedRole} \n **Mention:** <@&${removedRole.id}> \n **ID:** ${removedRole.id}`, inline: true },
          )
          .setTimestamp();
      }

      // Check for nickname changes
      if (oldMember.nickname !== newMember.nickname) {
        embed.addField('Nickname Before:', oldMember.nickname || 'None');
        embed.addField('Nickname After:', newMember.nickname || 'None');
      }

      const channel = await client.channels.fetch(logChannel);
      if (channel) {
        channel.send({ embeds: [embed] });
      } else {
        console.error(`Log channel (${logChannel}) not found.`);
      }
    } catch (error) {
      console.error('Error handling GuildMemberUpdate event:', error);
    }
  },
};

client.login(process.env.token);