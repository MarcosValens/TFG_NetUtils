const ping = require("@rochismo/ping");
const ip_cidr = require("ip-cidr");
const arp = require("node-arp");
const utils = require("./utils");
const Host = require("./models/host.js");
const parser = require("./macParser");

class Pinger {
    constructor() {
        this.hosts = [];
        this._sse = null;
        this.aliveHosts = [];
        utils.getProgress.bind(this);
    }

    /**
     * The ip parameter must contain the network cidr
     * @param {String} ip
     * @returns {Array|Promise} hosts
     */

    pingSweep(ip) {
        this.setRange(ip);
        this.populate();
        return this.fulfillPromisesAndFilterHosts();
    }

    /**
     *
     * @param {String} ip -> Must contain the cidr
     */
    setRange(ip) {
        const cidr = ip.split("/")[1];
        if (!cidr) return console.error("No cidr specified");
        this.aliveHosts = [];
        this.hosts = new ip_cidr(ip).toArray();
    }

    populate() {
        if (!this.hosts.length) {
            return console.error("There are no hosts available");
        }
        this.aliveHosts = this.hosts.map((host) => {
            return this.ping(host);
        });
    }

    async fulfillPromisesAndFilterHosts() {
        const pingedHosts = await utils.getProgress(
            this.aliveHosts,
            (progress) => {
                if (this._sse) {
                    this._sse.send(progress.toFixed(2));
                }
            }
        );
        return pingedHosts
            .filter((host) => host.alive)
            .map((data) => {
                return new Host(data);
            });
    }

    async ping(ip) {
        const data = await ping.promise.probe(ip);
        data.mac = await this.getMac(ip);
        return data;
    }

    /**
     * @param {Object} sse -> Used for server sent events to track progress
     *
     */
    set sse(sse) {
        this._sse = sse;
    }

    _getPlatform() {
        return process.platform === "win32"
            ? "readMACWindows"
            : process.platform === "linux"
            ? "readMACLinux"
            : "readMACMac";
    }

    async getMac(host) {
        const platforSpecific = this._getPlatform();
        const mac = await Promise.resolve(
            new Promise((resolve) => {
                arp[platforSpecific](host, (error, mac) => {
                    if (error) {
                        return resolve(error);
                    }
                    resolve(mac);
                });
            })
        );
        const data = parser.getData(mac);
        data.physicalAddress = mac;
        return data;
    }
}

module.exports = { Pinger, utils };
