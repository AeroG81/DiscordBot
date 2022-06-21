const { SlashCommandBuilder } = require("@discordjs/builders");
const axios = require("axios");
const { MessageEmbed } = require("discord.js");
//https://rapidapi.com/apidojo/api/shazam/
async function sendRequest(options) {
  let output = [];
  await axios
    .request(options)
    .then(function (response) {
      let position = 1;
      let tracks = response.data.tracks.hits;
      // tracks.length = Math.min(tracks.length, 5);
      let data = "```";
      for (let key in tracks) {
        data +=
          position +
          " :   " +
          tracks[key].track.title +
          " - " +
          tracks[key].track.subtitle +
          "\n";
        position++;
      }
      data += "```";
      output.push(tracks);
      return data;
    })
    .then(async function (response) {
      console.log("Search success");
      output.push(response);
    })
    .catch(function (error) {
      console.error(error);
    });
  return output;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search music by name")
    .addStringOption((option) =>
      option
        .setName("musicname")
        .setDescription("Name to search for")
        .setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const searchParam = interaction.options.getString("musicname");
    const options = {
      method: "GET",
      url: "https://shazam.p.rapidapi.com/search",
      params: { term: searchParam, locale: "en-US", offset: "0", limit: "5" },
      headers: {
        "X-RapidAPI-Key": "68c1d73560msh221f88772e988f9p1c8029jsn00f64d452e22",
        "X-RapidAPI-Host": "shazam.p.rapidapi.com",
      },
    };
    await interaction.reply({ content: "Loading...", fetchReply: true });
    const result = await sendRequest(options);

    const filter = (response) => {
      return !isNaN(response.content);
    };

    await interaction.editReply(result[1]).then(() => {
      interaction.channel
        .awaitMessages({ filter, max: 1, time: 60000, errors: ["time"] })
        .then((collected) => {
          let output = collected.first();
          let position = parseInt(output.content) - 1;
          let data = result[0][position];
          // inside a command, event listener, etc.
          const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(data.track.title)
            .setDescription(data.track.subtitle)
            .setURL(data.track.url)
            .setImage(data.track.images.coverart);
          interaction.followUp({ embeds: [embed] });
        })
        .catch((collected) => {
          interaction.followUp(
            "Unable to reply correct data , error: " + collected
          );
        });
    });
  },
};
