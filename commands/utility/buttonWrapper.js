const { ActionRowBuilder } = require('discord.js');

module.exports = (buttons, num) => {
	const components = [];
	let row = new ActionRowBuilder();

	for (let i = 0; i < buttons.length && i < 25; i++) {
		if (i % (num > 0 && num < 5 ? num : 5) === 0 && i > 0) {
			components.push(row);
			row = new ActionRowBuilder();
		}
		row.addComponents(buttons[i]);
	}
	if (row.components.length > 0) {
		components.push(row);
	}
	return components;
};
