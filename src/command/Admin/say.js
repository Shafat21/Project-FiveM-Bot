const { MessageEmbed } = require("discord.js"), 
    config = require('../../../server.json');

module.exports = {
    name: 'say',
    description: 'Send an Same Message',
    usage: '<prefix>say [Hello People]', //OPTIONAL (for the help cmd)
    examples: ['say Hello People'], //OPTIONAL (for the help cmd)
    aliases: ['repeat'],
    dir: "Admin",
    cooldown: 2, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: ["MANAGE_MESSAGES"], // OPTIONAL

    run: async (client, message, args) => {

		// Make sure a member was mentioned
		if (!message.args[0]) return message.channel.send(`User was not mentioned!`).then(m => m.timedDelete({ timeout: 5000 }));

		// Get members mentioned in message
		const members = await message.getMember(false);

		// Make sure atleast a guildmember was found
		if (!members[0]) return message.channel.send(`User was not found!`).then(m => m.timedDelete({ timeout: 10000 }));

        // send message
		try {
			const embed = new MessageEmbed(client, message.guild)
				.setColor(`#2f3136`)
				.setTitle(`${message.guild.name}`)
                .setAuthor({
                    name: `${message.author.username}`,
                    iconURL: `${message.author.displayAvatarURL({ format: 'png', size: 1024 })}`,
                    url: `${message.author.id}`
                })
				.addField('Remember:', `Do not reply to me because **[${message.author.username}](https://discord.com/users/${message.author.id})**  will not recieve the reply, take your stuff to their dms instead <:Promoted:908703648731762698> `)
				.addField(`${message.author.username}'s message:`, message.args.join(' ').slice(message.args[0].length))
				.setTimestamp()
                .setFooter({
                    name: `${message.author.username}`,
                    iconURL: `${message.author.displayAvatarURL({ format: 'png', size: 1024 })}`
                })
			await members[0].user.send({ embeds: [embed] });
			message.reply(`I have sent the DM`);
		} catch (err) {
			if (message.deletable) message.delete();
			client.logger.error(`Command: '${this.help.name}' has error: ${err.message}.`);
			message.reply(`Error happened`);
		}


    }
}