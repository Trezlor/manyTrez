const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('roll').setDescription('Roll a number between 0-100'),
	async execute(interaction) {
		const user = interaction.member;
		await interaction.reply(
			'```arm\n' +
				(!user.nickname ? user.displayName : user.nickname) +
				' rolled ' +
				Math.floor(Math.random() * 101) +
				'!\n```'
		);
	},
};
