const { Pinger, utils } = require("./src/pinger");
module.exports = (() => {
    const pinger = new Pinger();
    return { pinger, utils };
})();
