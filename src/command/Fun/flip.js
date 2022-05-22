const {
    MessageEmbed
} = require('discord.js');
let config = require("../../../server.json")

module.exports = {
    name: 'flip',
    description: 'Flip a coin.',
    usage: '<prefix>flip', //OPTIONAL (for the help cmd)
    aliases: ['flips'],
    dir: "Fun",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL

    run: async (client, message, args) => {
        const num = Math.round(Math.random()),
            result = `${num < 0.5 ? 'HEADS' : 'TAILS'}`;


        // Result
        const flip = new MessageEmbed()

            .setDescription(`**${message.author.username}**, *Your answer is* **${result}**`)
            .setColor("#2f3136")
            .setFooter({
                text: `${config.FOOTER}`,
                iconURL: `${config.SERVER_LOGO}`
            })

        message.channel.send({
            embeds: [flip]
        });

    }
}