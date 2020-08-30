const request = require('request');

class Fundamentus {
    constructor(url) {
        this.url = url;
    }

    async query(code, props) {
        const data = new Object();
        const url = this.url.replace(/${code}/gi, code);
        const html = request.get(url).query({ "papel": code });
        console.log(html);
        return data;
    }
}

module.exports = {
    Fundamentus
}
