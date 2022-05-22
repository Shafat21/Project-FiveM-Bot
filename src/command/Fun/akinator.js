const akinator = require('djs-akinator');

module.exports = {
    name: 'akinator',
    description: 'Play with akinator and it will guess your character.',
    usage: '<prefix>akinator', //OPTIONAL (for the help cmd)
    aliases: ['aki'],
    dir: "Fun",
    cooldown: 1, // Cooldown in seconds, by default it's 2 seconds | OPTIONAL
    
    run :async (client, message, args) => {   
        const language = "en";
        const childMode = "false";
        const gameType = "character";
        const useButtons = "true";
        const embedColor = "2f3136";

        akinator(message, {
            language: language,
            childMode: childMode,
            gameType: gameType,
            useButtons: useButtons,
            embedColor: embedColor
        })
		
    }
}