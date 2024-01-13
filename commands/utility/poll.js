const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription('Create a poll')
		.addStringOption((option) =>
			option
				.setName('poll-title')
				.setDescription('Title of the poll')
				.setMaxLength(50)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('option1')
				.setDescription('Option 1 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('option2')
				.setDescription('Option 2 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('option3')
				.setDescription('Option 3 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName('option4')
				.setDescription('Option 4 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName('option5')
				.setDescription('Option 5 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName('option6')
				.setDescription('Option 6 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option
				.setName('option7')
				.setDescription('Option 7 of 7')
				.setMaxLength(50)
				.setAutocomplete(true)
		),

	async autocomplete(interaction) {
		const value = interaction.options.getFocused();
		const choices = [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday',
		];
		const choicesFiltered = choices.filter((choice) => choice.includes(value)).slice(0, 25);

		if (!interaction) return;

		await interaction.respond(
			choicesFiltered.map((choice) => ({
				name: choice,
				value: choice,
			}))
		);
	},

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const { channel } = await interaction;
		const options = await interaction.options.data;
		const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];

		let embed = new EmbedBuilder().setTitle(`${options[0].value}`).setColor('Green');

		for (let i = 1; i < options.length; i++) {
			let emoji = emojis[i - 1];
			let option = options[i];
			embed.addFields({
				name: `${emoji} ${option.value}`,
				value: ' ',
			});
		}

		const message = await channel.send({ embeds: [embed] });

		for (let i = 1; i < options.length; i++) {
			let emoji = emojis[i - 1];
			message.react(emoji);
		}

		await interaction.editReply({ content: 'Poll created successfully' });
	},
};
