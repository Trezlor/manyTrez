const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('roll').setDescription('Roll a number between 0-100'),
	async execute(interaction) {
		const user = interaction.member;
		const randomNum = (num, addNum) => {
			return Math.floor(Math.random() * num + addNum);
		};
		const randomAnsiColorText = (text) => {
			return `[1;3${randomNum(6, 1)}m${text}[0m`;
		};
		await interaction.reply(
			'```ansi\n' +
				`${
					!user.nickname
						? randomAnsiColorText(user.displayName)
						: randomAnsiColorText(user.nickname)
				} rolled ${randomAnsiColorText(randomNum(101, 0))}` +
				' !```'
		);
	},
};
