const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolecleanup')
    .setDescription('Checks for unassigned roles and blank roles.'),

  async execute(interaction) {
    if (!interaction.member.permissions.has(['OWNER'])) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    const unassigned = new ButtonBuilder()
      .setCustomId('unassigned')
      .setLabel('Delete Unassigned')
      .setStyle(ButtonStyle.Primary);

    const blank = new ButtonBuilder()
      .setCustomId('blank')
      .setLabel('Delete Blank')
      .setStyle(ButtonStyle.Secondary);

    const both = new ButtonBuilder()
      .setCustomId('both')
      .setLabel('Delete Both')
      .setStyle(ButtonStyle.Danger);

    const none = new ButtonBuilder()
      .setCustomId('none')
      .setLabel('Delete None')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(unassigned, blank, both, none);

    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
      const guildRoles = interaction.guild.roles.cache;

      // Delay to allow Discord to update the cache
      await new Promise(resolve => setTimeout(resolve, 1000));

      const unassignedRoles = guildRoles.filter(
        role => role.members.size === 0 && role.id !== interaction.guild.id
      );

      const blankRoles = guildRoles.filter(
        role => role.permissions.bitfield === 0 && role.name.toLowerCase() === '@everyone'
      );

      const newRoles = guildRoles.filter(
        role => role.name.toLowerCase() === 'new role' && role.permissions.bitfield === 0
      );

      let unassignedResponse = 'There are no unassigned roles in this server.';
      let blankResponse = 'There are no blank roles in this server.';
      let newRolesResponse = 'There are no roles named "New Role" with default permissions in this server.';

      if (unassignedRoles.size > 0) {
        let roleList = '';
        for (const role of unassignedRoles.values()) {
          roleList += `${role.name}, `;
        }
        roleList = roleList.slice(0, -2); // Remove the trailing comma and space
        unassignedResponse = `Unassigned roles: ${roleList}`;
      }

      if (blankRoles.size > 0) {
        let roleList = '';
        for (const role of blankRoles.values()) {
          roleList += `${role.name}, `;
        }
        roleList = roleList.slice(0, -2); // Remove the trailing comma and space
        blankResponse = `Blank roles: ${roleList}`;
      }

      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`Role Cleanup for ${interaction.guild.name}`)
        .setDescription(`${unassignedResponse}\n${blankResponse}`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp();

      const response = await interaction.reply({
        content: 'Role cleanup:',
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });

      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

      if (confirmation.customId === 'unassigned') {
        // Delete unassigned roles
        for (const role of unassignedRoles.values()) {
          await role.delete();
        }
        await confirmation.update({ content: `Deleted Unassigned Roles`, components: [] });
      } else if (confirmation.customId === 'blank') {
        // Delete blank roles
        for (const role of blankRoles.values()) {
          await role.delete();
        }
        await confirmation.update({ content: `Deleted Blank Roles`, components: [] });
      } else if (confirmation.customId === 'both') {
        // Delete both unassigned and blank roles
        for (const role of unassignedRoles.values()) {
          await role.delete();
        }
        for (const role of blankRoles.values()) {
          await role.delete();
        }
        await confirmation.update({ content: `Deleted Both Unassigned and Blank Roles`, components: [] });
      } else if (confirmation.customId === 'none') {
        // Do nothing
        await confirmation.update({ content: 'No roles were deleted.', components: [] });
      }
    } catch (error) {
      console.log(error);
      //await interaction.reply({ content: 'An error occurred while trying to retrieve roles.', ephemeral: true });
    }
  },
};