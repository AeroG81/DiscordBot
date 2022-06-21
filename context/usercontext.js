const { ContextMenuCommandBuilder  } = require('@discordjs/builders');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('echo')
        .setType('USER'),
	async execute(interaction) {
        const name = interaction.targetUser.username;
		await interaction.reply(`Selected: ${name}`);
	},
};