const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

// Create a Map to store AFK users and their reasons
const afkUsers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Sets you as AFK'),

  async execute(interaction) {
    const user = interaction.user;

    // Create a select menu with AFK reasons as options
    const reasonModal = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('afk_reason')
          .setPlaceholder('Select an AFK reason')
          .addOptions([
            {
              label: 'Taking a break',
              value: 'Taking a break',
            },
            // Add more AFK reasons as needed
          ]),
      );

    // Send a reply to the user with the AFK reason select menu
    await interaction.reply({ content: 'Select an AFK reason:', components: [reasonModal] });

    // Create a filter to collect the user's selection from the select menu
    const filter = i => i.customId === 'afk_reason' && i.user.id === user.id;

    // Create a collector to listen for the user's selection
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    // When the collector ends (timeout or user selection received)
    collector.on('end', async collected => {
      // If no selection is collected, cancel AFK mode
      if (collected.size === 0) {
        await interaction.followUp({ content: 'AFK mode canceled', ephemeral: true });
        return;
      }

      // Get the reason selected by the user
      const reason = collected.first().values[0];

      // Set the user as AFK with the selected reason in the Map
      afkUsers.set(user.id, reason);

      // Create a remove button to remove the AFK status later
      const removeButton = new MessageSelectMenu()
        .setCustomId('remove_afk')
        .setPlaceholder('Remove AFK status')
        .addOptions([{ label: 'Remove AFK status', value: 'remove_afk' }]);

      // Create an action row with the remove button
      const row = new MessageActionRow()
        .addComponents(removeButton);

      // Send a reply to the user indicating that AFK mode is enabled
      await interaction.followUp({ content: `AFK mode enabled for reason "${reason}"`, components: [row] });

      // Create a collector to listen for the user's removal of AFK status
      const removeCollector = interaction.channel.createMessageComponentCollector({
        filter: i => i.customId === 'remove_afk' && i.user.id === user.id,
        time: 60000,
      });

      // When the removal collector ends (timeout or user removal received)
      removeCollector.on('end', async collected => {
        // If no removal is collected, AFK mode is still enabled
        if (collected.size === 0) {
          await interaction.followUp({ content: 'AFK mode is still enabled', ephemeral: true });
          return;
        }

        // Remove the user from the AFK Map when their status is removed
        afkUsers.delete(user.id);

        // Send a reply to the user welcoming them back and informing them that their AFK mode is removed
        await interaction.followUp({ content: `Welcome back, ${user.username}! Your AFK mode has been removed.`, ephemeral: true });
      });
    });
  },
};