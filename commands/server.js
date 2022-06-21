const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!')
        .setDMPermission(false),
	async execute(interaction) {
        await interaction.reply(
			`Server name: ${interaction.guild.name}
			\nTotal members: ${interaction.guild.memberCount}
			\nServer Created Time: ${interaction.guild.createdAt}
			\nServer Verification Level: ${interaction.guild.verificationLevel}
			\nJoined at: ${interaction.guild.joinedAt}
			`);
	},
};