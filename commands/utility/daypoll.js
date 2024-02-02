const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daypoll')
		.setDescription('Create a poll')
		.addStringOption((option) =>
			option
				.setName('title')
				.setDescription('Set a title')
				.setMaxLength(50)
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('day')
				.setDescription('Choose what day to show first (Monday - Sunday)')
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option.setName('description').setDescription('Set a description').setMaxLength(50)
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const choices = [
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday',
			'Sunday',
		];
		const filtered = choices.filter((choice) => choice.includes(focusedValue));

		if (!interaction) return;

		await interaction.respond(
			filtered.map((choice) => ({
				name: choice,
				value: choice,
			}))
		);
	},

	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true });

		const { channel } = await interaction;

		const title = interaction.options.getString('title');
		const description = interaction.options.getString('description');
		const dayInput = interaction.options.getString('day').toLowerCase();

		const user = interaction.member;
		const userName = !user.nickname ? user.displayName : user.nickname;

		let daysObj = [
			{
				name: 'monday',
				value: 0,
				reacted: ['Trezlor', 'Banana'],
			},
			{
				name: 'tuesday',
				value: 0,
				reacted: [],
			},
			{
				name: 'wednesday',
				value: 0,
				reacted: [],
			},
			{
				name: 'thursday',
				value: 0,
				reacted: [],
			},
			{
				name: 'friday',
				value: 0,
				reacted: [],
			},
			{
				name: 'saturday',
				value: 0,
				reacted: [],
			},
			{
				name: 'sunday',
				value: 0,
				reacted: [],
			},
		];

		const findEmoji = (name) => {
			return client.emojis.cache.find((emoji) => emoji.name === name);
		};

		const newDaysOrder = (day) => {
			const indexOfDay = daysObj.map((d) => d.name).indexOf(day);
			for (let i = 0; i < indexOfDay; i++) {
				daysObj.push(daysObj[i]);
			}
			daysObj = daysObj.slice(indexOfDay);
		};
		if (daysObj.map((d) => d.name).includes(dayInput) ? newDaysOrder(dayInput) : '');

		let embed = new EmbedBuilder()
			.setTitle(title)
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: `Created by ${userName}` })
			.setColor('Red')
			.addFields({
				name: ' ',
				value: ' ',
			});

		let backupEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
		const addDaysField = (num) => {
			const dayName = daysObj[num].name;
			const dayNameUpperCase = dayName.charAt(0).toUpperCase() + dayName.slice(1);
			embed.addFields({
				name: `${
					findEmoji(dayName.toLowerCase())
						? findEmoji(dayName.toLowerCase())
						: backupEmojis[num]
				}${dayNameUpperCase} (${daysObj.find((day) => day.name === dayName).value})`,
				value: `${
					daysObj[num].reacted[0]
						? daysObj[num].reacted
								.map((item) => {
									return `> ${item}`;
								})
								.join('\n')
						: '> -'
				}`,
				inline: true,
			});
		};

		for (let i = 0; i < daysObj.length; i++) {
			if (i % 3 == 0) {
				embed.addFields({
					name: ' ',
					value: ' ',
				});
			}
			addDaysField(i);
		}

		const message = await channel.send({
			embeds: [embed],
		});

		for (let i = 0; i < daysObj.length; i++) {
			let emoji = findEmoji(daysObj[i].name);
			emoji ? message.react(emoji) : message.react(backupEmojis[i]);
		}

		await interaction.editReply({ content: 'Post created successfully' });
	},
};
