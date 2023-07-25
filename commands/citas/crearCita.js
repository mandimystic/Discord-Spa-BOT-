const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db');
const date_regexr = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/;

// ButtonBuilder, ButtonStyle, ActionRowBuilder

module.exports = {
  data: new SlashCommandBuilder()
    .setName('crear-cita')
    .setDescription('Crea una nueva cita')
    .addStringOption(option =>
      option
        .setName('servicio')
        .setDescription('El servicio que desea reservar')
        .setRequired(true)
        .addChoices(
          { name: 'Masaje Relajante', value: 'Masaje Relajante' },
          { name: 'Masaje Californiano', value: 'Masaje Californiano' },
          { name: 'Reflexología', value: 'Reflexología' },
          { name: 'Reiki', value: 'Reiki' },
        ),
    )
    .addStringOption(option =>
      option
        .setName('fecha')
        .setDescription('Formato de fecha 01/01/2023')
        .setRequired(true),
    )
    .addStringOption(option =>
      option
        .setName('hora')
        .setDescription('Hora que desea reservar')
        .setRequired(true)
        .addChoices(
          { name: '10AM', value: '10AM' },
          { name: '11AM', value: '11AM' },
          { name: '12PM', value: '12PM' },
          { name: '2PM', value: '2PM' },
          { name: '3PM', value: '3PM' },
        ),
    ),
  async execute(interaction) {

    try {
      const servicio = interaction.options.getString('servicio');
      const fecha = interaction.options.getString('fecha');
      const hora = interaction.options.getString('hora');
      const id = interaction.user.id;

      if (!date_regexr.test(fecha)) return await interaction.reply('Formato de fecha invalida');

      db.prepare(`
        INSERT INTO citas (servicio, fecha, hora, discord_id)
        VALUES (?,?,?,?)
      `).run(servicio, fecha, hora, id);

      // const button = new ButtonBuilder()
      //   .setCustomId('primary')
      //   .setLabel('Like')
      //   .setStyle(ButtonStyle.Primary);
      //   // .setEmoji('123456789012345678');

      // const row = new ActionRowBuilder()
      //   .addComponents(button);

      await interaction.reply(`Cita creada para el servicio "${servicio}" con la fecha ${fecha} y hora ${hora} para el usuario <@${id}>`);
      // components: [row],
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
        return await interaction.reply('El usuario no existe');
      } else if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return await interaction.reply('Fecha ocupada, por favor elige otra fecha');
      }
      console.log(error);
      await interaction.reply('Ha habido un error');
    }
  },
};

// const collectorFilter = i => i.user.id === interaction.user.id;
// try {
//   const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

//   if (confirmation.customId === 'primary') {
//   console.log(click);
//   }
// } catch (e) {
//   await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
// }

