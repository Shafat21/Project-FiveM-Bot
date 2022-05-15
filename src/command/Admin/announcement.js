let config = require('../../../server.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'announcement',
    description: 'Send an Announcement to Announcement Channel',
    usage: '<prefix>announcement [Hello People]', //OPTIONAL (for the help cmd)
    examples: ['announcement Hello People'], //OPTIONAL (for the help cmd)
    aliases: ['announce'],
    dir: "Admin",
    cooldown: 2, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: ["MANAGE_MESSAGES"], // OPTIONAL
    
    run :async (client, message, args) => {   
        let messagetext = args.slice(0).join(' ');
        // var messagetext = message.args.join(' ');
        // let messagetext = args.join(' ').slice(message.args[0].length);

        if (!message.member.permissions.has("MANAGE_MESSAGES")) {
            return message.reply(`You have no Permission to do that`)
        }

        if (!config.ANNOUNCEMENT) {
            return client.logger.log(`Announcement Channel not set yet. Edit it on server.json`)
        }

        if (config.ANNOUNCEMENT && message.member.permissions.has("MANAGE_MESSAGES")) {
            const announcchannel = await client.channels.fetch(config.ANNOUNCEMENT)

            announcchannel.send(`${messagetext}`)
            announcchannel.send(`@everyone`)

           
        }
    }
}