const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('roll').setDescription('Roll a number between 0-100'),
	async execute(interaction) {
		await interaction.reply(
			'```arm\n' +
				interaction.user.displayName +
				' rolled ' +
				Math.floor(Math.random() * 101) +
				'!\n```'
		);
	},
};
