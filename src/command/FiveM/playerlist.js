let config = require('../../../server.json');
let emoji = require('../../../emoji.json');
const {
    MessageEmbed
} = require("discord.js");
const fetchTimeout = require('fetch-timeout');
const USER_AGENT = `Venom Fivem All Rounder Bot ${require('../../../package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;
const URL_PLAYERS = new URL('/players.json', config.SERVER_URL).toString();
const MAX_PLAYERS = config.MAX_PLAYERS;
const FETCH_TIMEOUT = 900;
const FETCH_OPS = {
    'cache': 'no-cache',
    'method': 'GET',
    'headers': {
        'User-Agent': USER_AGENT
    }
};
const getPlayers = function () {
    return new Promise((resolve, reject) => {
        fetchTimeout(URL_PLAYERS, FETCH_OPS, FETCH_TIMEOUT).then((res) => {
            res.json().then((players) => {
                resolve(players);
            }).catch(reject);
        }).catch(reject);
    })
};

module.exports = {
    name: 'playerlist',
    description: 'Send an Online Playerlist',
    usage: '<prefix>playerlist', //OPTIONAL (for the help cmd)
    examples: ['playerlist'], //OPTIONAL (for the help cmd)
    aliases: ['memberlist', 'memlist'],
    dir: "FiveM",
    cooldown: 3, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: ["MANAGE_MESSAGES"], // OPTIONAL
    
    run :async (client, message) => {  


        getPlayers().then((players) => {
                let time = new Date().toLocaleString() + ' GMT';

                let embed = new MessageEmbed()
                    .setAuthor("Ganglyfe RP Live Members", "https://cdn.discordapp.com/attachments/833753190859407411/947797317690466334/logo.gif")
                    .setColor("#2f3136")
                    .setFooter('© GangLyfe')
                    .addFields({
                        name: `${emoji.clock} Time`,
                        value: `\`\`\`${time}\`\`\``,
                        inline: true
                    })
                    .addFields({
                        name: `${emoji.online} Online Players`,
                        value: `\`\`\`${players.length} / ${MAX_PLAYERS}\`\`\``,
                        inline: true
                    })
                    .setTimestamp(new Date());
                if (players.length > 0) {

                    const fieldCount = 3;
                    const fields = new Array(fieldCount);
                    fields.fill('');

                    fields[0] = `**${emoji.member} Players On Server:**\n`;
                    for (var i = 0; i < players.length; i++) {
                        fields[(i + 1) % fieldCount] += `${emoji.dot} ID: ${players[i].id } ${emoji.dot} ${players[i].name.substr(0,15)} ${emoji.dot} Ping: ${players[i].ping} ms\n`;
                    }
                    for (var i = 0; i < fields.length; i++) {
                        let field = fields[i];
                        if (field.length > 0) embed.addField('\u200b', field);
                    }
                }

                message.reply({ embeds: [embed] });
                return client.logger.info(`${message.author.tag}  Sent Members log in ${message.guild.name} and ${players.length} players are Active in Server!`);
            
        })

           
        }
    }
