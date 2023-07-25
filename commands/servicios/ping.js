const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ver-servicios')
    .setDescription('Ver servicios del Spa'),
  async execute(interaction) {
    await interaction.reply('Masajes relajantes, Masaje Californiano, Reflexología, Reiki!');
  },
};