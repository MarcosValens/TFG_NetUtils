const axios = require("axios");
const macVendorsUrl = "https://api.macvendors.com/v1/lookup/";

class MacFetcher {
    constructor() {}

    async setToken(token) {
        this.token = token;
    }

    async getData(mac) {
        try {
            const response = await axios.default.get(`${macVendorsUrl}${mac}`, {
                headers: {
                    "Authorization": `Bearer ${this.token}`
                }
            });
            const {data} = response.data;
            return data;
        } catch(e) {
            throw e;
        }
    }
}

module.exports = new MacFetcher();
