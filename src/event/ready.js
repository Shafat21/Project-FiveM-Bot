const {
    MessageEmbed
} = require("discord.js");
const config = require("../../server.json");
const emoji = require("../../emoji.json")
const fetchTimeout = require('fetch-timeout');

const USER_AGENT = `Venom Fivem All Rounder Bot ${require('../../package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;

const URL_PLAYERS = new URL('/players.json', config.SERVER_URL).toString();
const URL_INFO = new URL('/info.json', config.SERVER_URL).toString();
const MAX_PLAYERS = config.MAX_PLAYERS;

const FETCH_TIMEOUT = 900;
const FETCH_OPS = {
    'cache': 'no-cache',
    'method': 'GET',
    'headers': {
        'User-Agent': USER_AGENT
    }
};
const CHANNEL_ID = config.CHANNEL_ID;
const UPDATE_TIME = config.UPDATE_TIME; // in ms

var LAST_COUNT = URL_INFO;


const getPlayers = function () {
    return new Promise((resolve, reject) => {
        fetchTimeout(URL_PLAYERS, FETCH_OPS, FETCH_TIMEOUT).then((res) => {
            res.json().then((players) => {
                resolve(players);
            }).catch(reject);
        }).catch(reject);
    })
};

const getVars = function () {
    return new Promise((resolve, reject) => {
        fetchTimeout(URL_INFO, FETCH_OPS, FETCH_TIMEOUT).then((res) => {
            res.json().then((info) => {
                resolve(info.vars);
            }).catch(reject);
        }).catch(reject);
    });
};



module.exports = async (client) => {

    let channel = client.channels.cache.get(CHANNEL_ID);

    const embed2 = new MessageEmbed()
        .setColor("#2F3136")
        .setDescription("Please wait for a minute!\nStatus is being ready!\nStatus will show after Update Time given in my system.")
        .setTitle(`VENOM FIVEM ALL ROUNDER BOT`)
        .setURL(`https://www.patreon.com/corddj`)
        .addFields({
            name: `FiveM`,
            value: `https://www.patreon.com/corddj`,
            inline: true
        },{
            name: `Fiverr`,
            value: `https://www.fiverr.com/shafata1am`,
            inline: true
        },{
            name: `Patreon`,
            value: `https://www.patreon.com/corddj`,
            inline: true
        },{
            name: `Discord`,
            value: `https://www.discord.com/users/493042603181342730`,
            inline: true
        })
        .setURL(`https://www.patreon.com/corddj`)
        .setFooter(`Venom FiveM All Rounder Bot. | Buy it from Fiverr ○ Patreon ○ contact VENOM#9208 on Discord.`);
    channel.bulkDelete(10);
    channel.send({ embeds: [embed2] }).then((msg) => {
        setInterval(() => {
            if (LAST_COUNT == null) {
                let time = new Date().toLocaleString();
                let embed2 = new MessageEmbed()
                    .setAuthor(`${config.SERVER_NAME}`, `${config.SERVER_LOGO}`)
                    .setColor("#2f3136")
                    .setFooter(`${config.FOOTER}`)
                    .setTimestamp(new Date())

                    .addFields({
                        name: `${emoji.server_logo} City Status`,
                        value: `\`\`\`🔴 Offline\`\`\``,
                        inline: true
                    })
                    .addFields({
                        name: `${emoji.refresh} Refreshed`,
                        value: `\`\`\`${time}\`\`\``,
                        inline: true
                    })
                    .addField("\u200b", `\u200b`, true)

                    .setImage(`${config.SERVER_BANNER}`);

                msg.edit({ embeds: [embed2] });
                msg.react(`${emoji.server_logo}`)

            } else if (URL_INFO) {

                getVars().then((_vars) => {
                    getPlayers().then((_players) => {
                        let time = new Date().toLocaleString();
                        let embed22 = new MessageEmbed()
                            .setAuthor(`${config.SERVER_NAME}`, `${config.SERVER_LOGO}`, `${config.SERVER_JOINING_LINK}`)
                            .setFooter(`${config.FOOTER}`)
                            .setColor("#2f3136")
                            .addFields({
                                name: `${emoji.server_logo} City Status`,
                                value: `\`\`\`🟢  Online\`\`\``,
                                inline: true
                            })
                            .addFields({
                                name: `${emoji.online} Online Players`,
                                value: `\`\`\`${_players.length} / ${MAX_PLAYERS}\`\`\``,
                                inline: true
                            })
                            .addFields({
                                name: `${emoji.refresh} Refreshed`,
                                value: `\`\`\`${time}\`\`\``,
                                inline: true
                            })

                            .addField(`${config.FIELD_TEXT_1}`, `${config.FIELD_PARAGRAPH_1}`, true)
                            .addField(`${config.FIELD_TEXT_2}`, `${config.FIELD_PARAGRAPH_2}`, true)
                            .setImage(`${config.SERVER_BANNER}`);
                            msg.edit({ embeds: [embed22] });
                            msg.react(`${emoji.server_logo}`)
                    })
                })

                
            };
        }, UPDATE_TIME);
    })

    client.user.setActivity('github.com/Shafat21', {
        'type': 'PLAYING'
    });


    client.logger.info(`${client.user.username}  =  𝙁𝙞𝙫𝙚𝙈 𝙎𝙚𝙧𝙫𝙚𝙧 𝙎𝙩𝙖𝙩𝙪𝙨 𝙞𝙨 𝙊𝙣𝙡𝙞𝙣𝙚❗❗`);



};