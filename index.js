const { Pinger, utils } = require("./src/pinger");
const macFetcher = require("./src/service/macFetcher");
module.exports = (() => {
    const pinger = new Pinger(macFetcher);
    return { pinger, utils };
})();
