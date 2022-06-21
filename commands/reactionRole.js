const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("react")
    .setDescription("Allow Role Reaction")
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Write a description")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("Channel to add this message to")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option.setName("role").setDescription("Select a role").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("emoji").setDescription("Enter a emoji").setRequired(true)
    )
    .setDMPermission(false),
  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const emoji = interaction.options
      .getString("emoji")
      .match(/[\p{Emoji}\u200d]+/gu);
    const channel = interaction.options.getChannel("channel");
    const description = interaction.options.getString("description");
    if (!role || !channel || !description || !emoji) return;

    const message = await channel.send({
      content: description,
      fetchReply: true,
    });
    const feedback = await interaction.reply({ content: "Success" });
    message.react(emoji[0]);
    // msg.react(emoji[0]);
    // return ['👍', '👎'].includes(reaction.emoji.name) && !user.bot;
    const filter = (reaction, user) => {
      return emoji.includes(reaction.emoji.name) && !user.bot;
    };

    const collector = message.createReactionCollector({
      filter,
      time: 2027999995,
    });

    collector.on("collect", (reaction, user) => {
      // let member = reaction.message.guild.members.fetch(user.id);
      // console.log(member);
      // console.log(member.guild);
      reaction.message.guild.members.cache.get(user.id).roles.add(role);
      console.log(`Role assigned ${role.name} to ${user.tag}`);
    });

    collector.on("end", (collected) => {
      console.log(`Collected ${collected.size} items`);
    });

    /* Await Reactions
        message.awaitReactions({ filter, max: 4, time: 30000, errors: ['time'] })
            .then(collected => console.log(collected.size))
            .catch(collected => {
                console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            });
        */
  },
};
