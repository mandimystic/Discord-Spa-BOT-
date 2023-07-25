const { SlashCommandBuilder, codeBlock } = require('discord.js');
const db = require('../../db');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mis-citas')
    .setDescription('Ver mis citas'),
  async execute(interaction) {
    try {

      const id = interaction.user.id;

      const citas = db.prepare(`
        SELECT * FROM citas
        WHERE discord_id = ?
      `).all(id);

      const formatedNotes = citas.map(cita => [cita.servicio, cita.fecha, cita.hora || '']);

      // Parte ACSII: crear tabla física

      const table =
    new AsciiTable3('mis citas')
      .setHeading('Servicio', 'Fecha', 'Hora')
      .setAlign(3, AlignmentEnum.CENTER)
      .addRowMatrix(formatedNotes);

      await interaction.reply(codeBlock(table));

    } catch (error) {
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};
