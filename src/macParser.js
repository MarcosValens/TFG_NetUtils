const xmlParser = require("xml-js");
const path = require("path");

class Parser {
    constructor() {
        this.macs = [];
        this.init();
    }
    init() {
        const xml = require("fs").readFileSync(
            path.join(__dirname, "macaddress.io-db.xml")
        );
        const parsed = xmlParser.xml2json(xml, { compact: true, spaces: 4 });
        const macs = JSON.parse(parsed);
        // IDFK who made this xml but it has to be like this
        this.macs = macs.records.record;
    }

    parseData(data, mac) {
        if (!data) return {};
        // It has to be done like this because it has this shit attribute _text
        return new Promise((resolve) => {
            setTimeout(() => {
                const mapped = Object.keys(data).reduce((object, key) => {
                    object[key] = data[key]._text;
                    return object;
                }, {});
                resolve(mapped);
            }, 1);
        });
    }

    getData(mac) {
        if (mac === true) return {};
        return new Promise((resolve) => {
            setTimeout(async () => {
                const firstThree = mac.match("^(.{8})")[0].toUpperCase();
                const dataFound = this.macs.find(
                    ({ oui: { _text } }) => _text === firstThree
                );
                const parsedData = await this.parseData(dataFound, mac);
                resolve(parsedData);
            }, 1);
        });
    }
}

module.exports = new Parser();
