const { default: axios } = require('axios');
const { SlashCommandBuilder, EmbedBuilder, Colors } = require('discord.js');

const createEmbed = (country, weather) => {
  const exampleEmbed = new EmbedBuilder ()
    .setColor(Colors.country.flags.png)
    .setTitle(country.name.common)
    .setURL(`https://es.wikipedia.org/wiki/${country.name.common}`)
    .setDescription('Información del país')
    .setThumbnail(country.flags.png)
    .addFields(
      { name: 'Capital', value: `${country.capital[0]}`, inline: true },
      { name: 'Población', value: `${country.population}`, inline: true },
      { name: 'Temperatura', value: `${weather.main.feels_like}`, inline: true },
    )
    .setImage(country.flags.png);
  return exampleEmbed;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buscar-pais')
    .setDescription('Muestra la informacion de un país')
    .addStringOption(option =>
      option
        .setName('nombre')
        .setDescription('El nombre del país a buscar')
        .setRequired(true),
    ),
  async execute(interaction) {
    try {
      const name = interaction.options.getString('nombre');
      const { data: countries } = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
      const { data: weather } = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${countries[0].latlng[0]}&lon=${countries[0].latlng[1]}&appid=c6af386868bc900725630416741f35eb&units=metric/`);
      const embed = createEmbed (countries[0], weather);
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.reply('El pais no existe');
    }
  },
};