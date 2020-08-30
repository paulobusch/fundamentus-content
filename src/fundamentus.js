const request = require('sync-request');

class Fundamentus {
    constructor(url) {
        this.url = url;
    }

    async query(code, props) {
        const data = new Object();
        const result = await request('GET', `${this.url}?papel=${code}`, {
            headers: { 'User-Agent': 'Chrome/84.0.4147.135' }
        });
        console.log(result.statusCode);
        if (result.statusCode !== 200) return data;
        const html = result.getBody('utf8');
        console.log(html);
        return data;
    }
}

module.exports = {
    Fundamentus
}
