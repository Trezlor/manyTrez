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

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		const { channel } = await interaction;
		const options = await interaction.options.data;

		const user = interaction.member;
		const userName = !user.nickname ? user.displayName : user.nickname;
		const userAvatar = interaction.client.user.displayAvatarURL();
		const botAvatar = interaction.user.avatarURL();

		// Backup logic if other method turns out to be shit
		// const ayy = client.emojis.cache.get('305818615712579584');

		const findEmoji = (emojiName) => {
			return client.emojis.cache.find((emoji) => emoji.name === emojiName);
		};

		const emojis = [
			findEmoji('monday'),
			findEmoji('tuesday'),
			findEmoji('wednesday'),
			findEmoji('thursday'),
			findEmoji('friday'),
			findEmoji('saturday'),
			findEmoji('sunday'),
		];

		let embed = new EmbedBuilder()
			.setTitle(`${options[0].value}`)
			.setAuthor({
				name: userName,
				value: userName,
				iconURL: botAvatar,
			})
			.setThumbnail(userAvatar)
			.setTimestamp(Date.now())
			.setColor('Green');

		for (let i = 1; i < options.length; i++) {
			let emoji = emojis[i - 1];
			let option = options[i];
			embed.addFields({
				name: `${emoji} ${option.value}: 0`,
				value: ' ',
				inline: true,
			});
		}

		const message = await channel.send({ embeds: [embed] });

		for (let i = 1; i < emojis.length; i++) {
			let emoji = emojis[i];
			message.react(emoji);
		}

		await interaction.editReply({ content: 'Poll created successfully' });
	},
};
