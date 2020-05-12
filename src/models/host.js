module.exports = class Host {
    /**
     * @property {String} address -> The address of the host 
     * @property {Object} time -> The time (total, minimum, max and average) it took to probe the host 
     * @property {Object} openPorts -> The ports that are opened in the current host
     * @param {Object} data -> It contains the results from a ping probe
     */
    constructor(data) {
        this.address = data.host;
        this.mac = data.mac;
        this.time = {
            total: data.time,
            min: data.min,
            max: data.max,
            avg: data.avg
        };
    }
}