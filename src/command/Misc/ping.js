module.exports = {
    name: 'ping',
    description: 'ping',
    usage: '<prefix>example [ping]', //OPTIONAL (for the help cmd)
    examples: ['example', 'example ping'], //OPTIONAL (for the help cmd)
    aliases: ['eg'],
    dir: "directoryName",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    permissions: [], // OPTIONAL
    
    run :async (client, message, args) => {   
        message.reply(`Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**`)
    }
}