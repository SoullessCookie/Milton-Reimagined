const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color')
    .setDescription('Create a role with a custom color.')
    .addStringOption(option => 
        option.setName('hex')
            .setDescription('The hex code of the color.')
            .setRequired(true)),

  async execute(interaction) {
    const hexCode = interaction.options.getString('hex');

    // Check if the role already exists
    const role = interaction.guild.roles.cache.find(role => role.name === hexCode);

    if (role) {
      // If the role exists, assign it to the user
      await interaction.member.roles.add(role);
      await interaction.reply(`Role ${hexCode} already exists. Assigned to user.`);
    } else {
      // If the role doesn't exist, create it and assign it to the user
      const newRole = await interaction.guild.roles.create({
        name: hexCode,
        color: hexCode
      });
      await interaction.member.roles.add(newRole);
      await interaction.reply(`Role ${hexCode} created and assigned to user.`);
    }
  }
};