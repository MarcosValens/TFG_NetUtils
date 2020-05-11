const {Pinger, utils} = require('./src/pinger');

module.exports = (async () => {
    const pinger = new Pinger();
    const data = await pinger.pingSweep("192.168.1.0/24");
    console.log(data);
    return {pinger, utils}
})();