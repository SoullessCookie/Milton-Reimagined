const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Create a role with a custom color.')
    .addStringOption(option =>
      option.setName('hex')
        .setDescription('The hex code of the color.')
        .setRequired(true)),

  async execute(interaction) {
    // Get the hex code from the command options
    const hexCode = interaction.options.getString('hex');

    // Check if the role already exists with the same name as the hex code
    const role = interaction.guild.roles.cache.find(role => role.name === hexCode);

    // Find all the roles of the user and filter out the non-hex roles
    const userRoles = interaction.member.roles.cache.filter(r => r.name.startsWith("#"));

    // Remove all the user's existing hex roles
    userRoles.forEach(async (r) => {
      await interaction.member.roles.remove(r);
    });

    if (role) {
      // If the role already exists, assign it to the user
      await interaction.member.roles.add(role);
      await interaction.reply(`Role ${hexCode} already exists. Assigned to user.`);
    } else {
      // If the role doesn't exist, create it and assign it to the user
      const newRole = await interaction.guild.roles.create({
        name: hexCode,
        color: hexCode
      });

      const embed = new EmbedBuilder()
        .setColor(`${hexCode}`)
        .setTitle(`Custom Color Role`)
        .addFields({ name: ' ', value: `Role ${hexCode} created and assigned to user.` })
        .setTimestamp();

      try {
        await interaction.member.roles.add(newRole);
        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        const logChannel = interaction.client.channels.cache.get(process.env.errorchannelid);
        if (logChannel) {
          logChannel.send(`Command: ${interaction.commandName}\nUser: ${interaction.user.tag}\nTime: ${new Date().toUTCString()}\nError: ${error}`);
        }
        await interaction.reply({ content: 'An error occurred while trying to execute this command.', ephemeral: true });
      }
    }
  },
};