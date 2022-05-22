const { MessageEmbed } = require("discord.js");
const config = require("../../server.json");
const fetchTimeout = require('fetch-timeout');

module.exports = async (client) => {

    const USER_AGENT = `Venom Fivem All Rounder Bot ${require('../../package.json').version} , Node ${process.version} (${process.platform}${process.arch})`;

    const URL_PLAYERS = new URL('/players.json', config.SERVER_URL).toString();
    const URL_INFO = new URL('/info.json', config.SERVER_URL).toString();
    const MAX_PLAYERS = config.MAX_PLAYERS;
    const TICK_MAX = 1 << 9; // max bits for TICK_N
    const FETCH_TIMEOUT = 900;
    const FETCH_OPS = {
        'cache': 'no-cache',
        'method': 'GET',
        'headers': {
            'User-Agent': USER_AGENT
        }
    };
    const channel = await client.channels.fetch(config.CHANNEL_ID)
    const CHANNEL_ID = config.CHANNEL_ID;
    const MESSAGE_ID = config.MESSAGE_ID;
    const UPDATE_TIME = config.UPDATE_TIME; // in ms

    var TICK_N = 0;
    var MESSAGE;
    var LAST_COUNT;
    var STATUS;

    var loop_callbacks = []; // for testing whether loop is still running

    const sendOrUpdate = function (embed) {
        if (MESSAGE !== undefined) {
            MESSAGE.edit({embed:[embed]}).then(() => {
                client.logger.info(`FiveM Server Status is Update Sucess!`);
            }).catch(() => {
                client.logger.info(`FiveM Server Status is Update Sucess!`);
            })
        } else {
            let channel = client.channels.cache.get(CHANNEL_ID);
            if (channel !== undefined) {
                channel.fetchMessage(MESSAGE_ID).then((message) => {
                    MESSAGE = message;
                    message.edit({embed:[embed]}).then(() => {
                        client.logger.info(`FiveM Server Status is Update Sucess!`);
                    }).catch(() => {
                        client.logger.info(`FiveM Server Status is Update Sucess!`);
                    });
                }).catch(() => {
                    channel.send({embed:[embed]}).then((message) => {
                        MESSAGE = message;
                        client.logger.info(`Sent message (${message.id})`);
                    }).catch(console.log);
                })
            } else {
                client.logger.info(`Update channel not set`);
            }
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

    const getVars = function () {
        return new Promise((resolve, reject) => {
            fetchTimeout(URL_INFO, FETCH_OPS, FETCH_TIMEOUT).then((res) => {
                res.json().then((info) => {
                    resolve(info.vars);
                }).catch(reject);
            }).catch(reject);
        });
    };

    const UpdateEmbed = function () {
        let embed = new MessageEmbed()
            .setAuthor(`${config.SERVER_NAME}`, `${config.SERVER_LOGO}`)
            .setColor("#2f3136")
            .setFooter(TICK_N % 2 === 0 ? `${config.FOOTER_UPDATE_1}` : `${config.FOOTER_UPDATE_2}`)
            .setTimestamp(new Date())
        return embed;
    };

    const offline = function () {
        let time = new Date().toLocaleString() + ' GMT';
        let embed = UpdateEmbed()
            .setColor("#2f3136")
            .addFields({
                name: 'City Status',
                value: `\`\`\`🔴 Offline\`\`\``,
                inline: true
            })
            .addFields({
                name: 'Refreshed',
                value: `\`\`\`${time}\`\`\``,
                inline: true
            })
            .addField("\u200b", `\u200b`, true)

            .setImage(`${config.SERVER_BANNER}`);
        sendOrUpdate({embed:[embed]});
        LAST_COUNT = null;
    };

    const updateMessage = function () {
        getVars().then((_vars) => {
            getPlayers().then((players) => {

                let time = new Date().toLocaleString() + ' GMT';

                let embed = UpdateEmbed()
                    .addFields({
                        name: 'City Status',
                        value: `\`\`\`🟢  Online\`\`\``,
                        inline: true
                    })
                    .addFields({
                        name: 'Online Players',
                        value: `\`\`\`${players.length} / ${MAX_PLAYERS}\`\`\``,
                        inline: true
                    })
                    .addFields({
                        name: 'Refreshed',
                        value: `\`\`\`${time}\`\`\``,
                        inline: true
                    })
                    
                    .addField(`${config.FIELD_TEXT_1}`, `${config.FIELD_PARAGRAPH}`, true)
                    .setImage(`${config.SERVER_BANNER}`);

                sendOrUpdate({embed:[embed]});

                LAST_COUNT = players.length;
            }).catch(offline);
        }).catch(offline);
        TICK_N++;
        if (TICK_N >= TICK_MAX) {
            TICK_N = 0;
        }
        for (var i = 0; i < loop_callbacks.length; i++) {
            let callback = loop_callbacks.pop(0);
            callback();
        }
    };
    





    const embed = new MessageEmbed()
    .setColor("#2F3136")
    .setDescription("Please wait for a minute!\nStatus is being ready!")
    channel.send({embed:[embed]});
    channel.bulkDelete(10);
    channel.send(embed).then((message) => {
        setInterval(() =>{
            message.edit({embed:[updateMessage]});
        },UPDATE_TIME)
    });

    

    client.user.setActivity('github.com/Shafat21', {
        'type': 'PLAYING'
    });
    

    client.logger.info(`${client.user.username} FiveM Server Status is online!`);


};
