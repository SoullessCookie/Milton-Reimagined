const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rolecleanup')
    .setDescription('Checks for unassigned roles and blank roles.'),

  async execute(interaction) {
    // Check if the user invoking the command is the server owner
    if (!interaction.member.permissions.has('OWNER')) {
      return await interaction.reply('You do not have permission to use this command.');
    }

    // Create buttons for different actions: delete unassigned, delete blank, delete both, delete none
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

    // Create an action row to contain the buttons
    const row = new ActionRowBuilder()
      .addComponents(unassigned, blank, both, none);

    // Define a filter to only allow the interaction from the original user
    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
      // Get all roles from the server's role cache
      const guildRoles = interaction.guild.roles.cache;

      // Delay to allow Discord to update the cache (optional, for role cache accuracy)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter roles that are unassigned (no members) and roles that are blank (name: @everyone, no permissions)
      const unassignedRoles = guildRoles.filter(role => role.members.size === 0 && role.id !== interaction.guild.id);
      const blankRoles = guildRoles.filter(role => role.permissions.bitfield === 0 && role.name.toLowerCase() === '@everyone');

      // Create response messages based on the filtered roles
      let unassignedResponse = 'There are no unassigned roles in this server.';
      let blankResponse = 'There are no blank roles in this server.';

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

      // Create an embed with the role cleanup information
      const embed = new EmbedBuilder()
        .setColor('#0099FF')
        .setTitle(`Role Cleanup for ${interaction.guild.name}`)
        .setDescription(`${unassignedResponse}\n${blankResponse}`)
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
        .setTimestamp();

      // Send the interaction response with the embed and action row containing buttons
      const response = await interaction.reply({
        content: 'Role cleanup:',
        embeds: [embed],
        components: [row],
        ephemeral: true,
      });

      // Await a message component interaction (button click) from the original user with a 60-second timeout
      const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

      // Handle different button clicks based on the customId of the clicked button
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
      // Handle any error that occurred during role cleanup (optional)
      await interaction.reply({ content: 'An error occurred while trying to retrieve roles.', ephemeral: true });
    }
  },
};