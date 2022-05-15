const axios = require('axios');
let server = require('../../../server.json');

const getPlayerCount = async () => {
    try {
        const resp = await axios.get('http://'+server.SERVER_URL+'/players.json');
        
        
            let total = resp;
            return total;
        

    } catch (err) {
        console.error(err);

    }
};

module.exports.getPlayerCount = getPlayerCount;

