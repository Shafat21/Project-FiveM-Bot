const fetch = require('node-fetch'),
	{ MessageEmbed } = require('discord.js')

module.exports = {
    name: 'advice',
    description: 'Get some random advice',
    usage: '<prefix>advice', //OPTIONAL (for the help cmd)
    examples: ['example', 'example ping'], //OPTIONAL (for the help cmd)
    aliases: ['adviceme'],
    dir: "Fun",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: [], // OPTIONAL
    
    run :async (client, message, args) => {   
        // send 'waiting' message to show bot has recieved message
		const msg = await message.channel.send(`Loading...`);
		// Connect to API and fetch data
			const data = await fetch('https://api.adviceslip.com/advice').then(res => res.json());
			msg.delete();
			const embed = new MessageEmbed()
				.setColor("2f3136")
				.setDescription(`${data.slip.advice}`);
			message.channel.send({ embeds: [embed] });
		
    }
}