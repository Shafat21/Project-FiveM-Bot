// variables
const	{ MessageActionRow, MessageButton, CommandInteraction } = require('discord.js'),
	timeout = 120000;

module.exports = async (bot, type, pages, userID) => {
	let page = 0;

	const row = new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId('11')
            	.setEmoji('967746538359107594')
				.setStyle('PRIMARY'),
			new MessageButton()
				.setCustomId('22')
            	.setEmoji('967746538124218399')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('33')
            	.setEmoji('967746538317160500')
				.setStyle('SECONDARY'),
			new MessageButton()
				.setCustomId('44')
            	.setEmoji('967746537935499295')
				.setStyle('PRIMARY'),
		);
	let curPage;
	if (type instanceof CommandInteraction) {
		curPage = await type.reply({ embeds: [pages[page]], components: [row], fetchReply: true });
	} else {
		curPage = await type.send({ embeds: [pages[page]], components: [row] });
	}

	const buttonCollector = await curPage.createMessageComponentCollector({ componentType: 'BUTTON', time: timeout });

	// find out what emoji was reacted on to update pages
	buttonCollector.on('collect', (i) => {
		if (i.user.id !== userID) return;
		switch (Number(i.customId)) {
			case 11:
				page = 0;
				break;
			case 22:
				page = page > 0 ? --page : 0;
				break;
			case 33:
				page = page + 1 < pages.length ? ++page : (pages.length - 1);
				break;
			case 44:
				page = pages.length - 1;
				break;
			default:
				break;
		}
		i.update({ embeds: [pages[page]] });
	});

	// when timer runs out remove all reactions to show end of pageinator
	buttonCollector.on('end', () => curPage.edit({ embeds: [pages[page]], components: [] }));
	return curPage;
};