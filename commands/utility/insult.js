const { SlashCommandBuilder } = require('discord.js');
const insultsArray = require('./insultsArray.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('Make an insult to someone')
		.addStringOption((option) =>
			option.setName('name').setDescription('Name of person you wanna insult').setRequired(true)
		),
	async execute(interaction) {
		const insults = insultsArray.insults;
		const randomNum = Math.floor(Math.random() * insults.length);
		const name = interaction.options.getString('name');

		await interaction.reply(
			name[0] === '<' ? `${name} ${insults[randomNum]}` : `${name}, ${insults[randomNum]}`
		);
	},
};
