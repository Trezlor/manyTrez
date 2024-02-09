const {
	SlashCommandBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
	ComponentType,
} = require('discord.js');
const buttonWrapper = require('./buttonWrapper');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('daypoll')
		.setDescription('Create a poll')
		.addStringOption((option) =>
			option.setName('title').setDescription('Set a title').setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName('day')
				.setDescription('Choose what day to show first (Monday - Sunday)')
				.setRequired(true)
				.setAutocomplete(true)
		)
		.addStringOption((option) =>
			option.setName('image').setDescription('Provide an image link')
		)
		.addStringOption((option) =>
			option.setName('description').setDescription('Set a description')
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
		const image = interaction.options.getString('image');

		const user = interaction.member;
		const userName = !user.nickname ? user.displayName : user.nickname;

		const backupEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣'];
		let daysArray = [
			{
				name: 'monday',
				value: 0,
				reacted: [],
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

		// Find custom discord emojis
		const findEmoji = (name) => {
			return client.emojis.cache.find((emoji) => emoji.name === name);
		};

		// Rearrange order of days based on user input
		const newDaysOrder = (dayInput) => {
			const indexOfDay = daysArray.map((day) => day.name).indexOf(dayInput);
			for (let i = 0; i < indexOfDay; i++) {
				daysArray.push(daysArray[i]);
			}
			daysArray = daysArray.slice(indexOfDay);
		};
		if (daysArray.map((day) => day.name).includes(dayInput)) {
			newDaysOrder(dayInput);
		}

		// Make embed
		let embed = new EmbedBuilder()
			.setTitle(`✨ ${title}`)
			.setDescription(description)
			.setTimestamp()
			.setFooter({ text: `Created by ${userName}` })
			.setColor('#FF0000')
			.setImage(image)
			.addFields(
				{
					name: ' ',
					value: ' ',
				},
				{
					name: ' ',
					value: ' ',
				}
			);

		const addEmbedField = (embed, num) => {
			const dayName = daysArray[num].name;
			const dayNameUpperCase = dayName.charAt(0).toUpperCase() + dayName.slice(1);

			embed.addFields({
				name: `${
					findEmoji(dayName.toLowerCase())
						? findEmoji(dayName.toLowerCase())
						: backupEmojis[num]
				} ${dayNameUpperCase} ( ${
					daysArray.find((day) => day.name === dayName).value
				} )`,
				value: `${
					daysArray[num].reacted[0]
						? daysArray[num].reacted
								.map((item) => {
									return `- ${item.name}`;
								})
								.join('\n')
						: '> -'
				}`,
				inline: true,
			});
		};

		// Set up initial embed fields
		for (let i = 0; i < daysArray.length; i++) {
			addEmbedField(embed, i);
		}

		// Button builder
		const buttons = [];
		const button = (day, num) => {
			const dayToUpperCase = day.charAt(0).toUpperCase() + day.slice(1);
			buttons.push(
				new ButtonBuilder()
					.setLabel(dayToUpperCase)
					.setEmoji(
						findEmoji(day)
							? `<a:${findEmoji(day).name}:${findEmoji(day).id}>`
							: backupEmojis[num]
					)
					.setStyle(ButtonStyle.Primary)
					.setCustomId(day)
			);
		};
		daysArray.map((day, num) => button(day.name, num));

		// Send embed
		const message = await channel.send({
			embeds: [embed],
			components: buttonWrapper(buttons, 3),
		});

		// Button collector
		const collector = message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 604_800_000,
		});

		collector.on('collect', (interaction) => {
			const receivedEmbed = message.embeds[0];
			const newEmbed = EmbedBuilder.from(receivedEmbed);

			const user = interaction.member;
			const userName = user.displayName ? user.displayName : user.nickname;
			const userId = user.id;

			newEmbed.data.fields = [];
			newEmbed.addFields(
				{
					name: ' ',
					value: ' ',
				},
				{
					name: ' ',
					value: ' ',
				}
			);

			daysArray.map((day) => {
				if (interaction.customId === day.name) {
					if (
						!!day.reacted.find((user) => {
							return user.id === userId;
						})
					) {
						const indexOfId = day.reacted.map((user) => user.id).indexOf(userId);
						day.reacted.splice(indexOfId, 1);
					} else {
						day.reacted.push({
							name: userName,
							id: userId,
						});
					}
					day.value = day.reacted.length;
				}
			});

			for (let i = 0; i < daysArray.length; i++) {
				addEmbedField(newEmbed, i);
			}

			interaction.update({
				embeds: [newEmbed],
			});
			return;
		});

		collector.on('end', () => {
			buttons.map((button) => button.setDisabled(true));
			message.edit({
				components: buttonWrapper(buttons, 3),
			});
		});

		// Inform user post was successful
		await interaction.editReply({ content: 'Post created successfully' });
	},
};
