const { SlashCommandBuilder, codeBlock } = require('discord.js');
const db = require('../../db');
const { AsciiTable3, AlignmentEnum } = require('ascii-table3');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('todas-las-citas')
    .setDescription('Ver todas las citas'),
  async execute(interaction) {
    if (interaction.user.id !== '1127974771175477318') return;
    try {
      const citas = db.prepare(`
        SELECT citas.servicio, citas.fecha,citas.hora, users.name
        FROM citas
        JOIN users
            ON citas.discord_id = users.discord_id
      `).all();

      const formatedNotes = citas.map(cita => [cita.servicio, cita.fecha, cita.hora || '', cita.name]);
      const table =
    new AsciiTable3('mis citas')
      .setHeading('Servicio', 'Fecha', 'Hora', 'Nombre')
      .setAlign(3, AlignmentEnum.CENTER)
      .addRowMatrix(formatedNotes);

      await interaction.reply(codeBlock(table));

    } catch (error) {
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};
