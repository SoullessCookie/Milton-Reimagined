const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

const afkUsers = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('Sets you as AFK'),

  async execute(interaction) {
    const user = interaction.user;

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
            {
              label: 'Eating',
              value: 'Eating',
            },
            {
              label: 'In a meeting',
              value: 'In a meeting',
            },
            {
              label: 'Busy with work',
              value: 'Busy with work',
            },
            {
              label: 'Sleeping',
              value: 'Sleeping',
            },
          ]),
      );

    await interaction.reply({ content: 'Select an AFK reason:', components: [reasonModal] });

    const filter = i => i.customId === 'afk_reason' && i.user.id === user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('end', async collected => {
      if (collected.size === 0) {
        await interaction.followUp({ content: 'AFK mode canceled', ephemeral: true });
        return;
      }

      const reason = collected.first().values[0];

      afkUsers.set(user.id, reason);

      const removeButton = new MessageSelectMenu()
        .setCustomId('remove_afk')
        .setPlaceholder('Remove AFK status')
        .addOptions([{ label: 'Remove AFK status', value: 'remove_afk' }]);

      const row = new MessageActionRow()
        .addComponents(removeButton);

      await interaction.followUp({ content: `AFK mode enabled for reason "${reason}"`, components: [row] });

      const removeCollector = interaction.channel.createMessageComponentCollector({
        filter: i => i.customId === 'remove_afk' && i.user.id === user.id,
        time: 60000,
      });

      removeCollector.on('end', async collected => {
        if (collected.size === 0) {
          await interaction.followUp({ content: 'AFK mode is still enabled', ephemeral: true });
          return;
        }

        afkUsers.delete(user.id);

        await interaction.followUp({ content: `Welcome back, ${user.username}! Your AFK mode has been removed.`, ephemeral: true });
      });
    });
  },
};