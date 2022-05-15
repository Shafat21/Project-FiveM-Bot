let PlayerCount = require('../../utils/handlers/playerlist');
const { MessageEmbed } = require('discord.js');
const dig = require('gamedig');

module.exports = {
    name: 'playerlist',
    description: 'See all players conected',
    usage: '<prefix>playerlist', //OPTIONAL (for the help cmd)
    examples: ['plist'], //OPTIONAL (for the help cmd)
    aliases: ['plist'],
    dir: "FiveM",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: [], // OPTIONAL
    
    run :async (message, args) => {   
        return dig.query({
            type: 'fivem',
            host: PlayerCount.ip,
            port: PlayerCount.port,
            socketTimeout: 5000,
            udpTimeout: 10000
        }).then((info) => {
            const embed = new MessageEmbed()
                .setAuthor(info.name)
                .setColor(PlayerCount.color)
                .addField(`Online`, `${info.raw.clients}/${info.raw.sv_maxclients}`, true)
            message.channel.send(embed)
        }).catch((error) => {
            message.reply(`It seems the server is **offline!**`)
        })
    }
}
