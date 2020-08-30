const request = require('request-promise').defaults({ encoding: 'latin1' });
const cheerio = require('cheerio');

class Fundamentus {
    constructor(url) {
        this.url = url;
    }

    async readData(code, props) {
        const data = new Object();
        const html = await request(`${this.url}?papel=${code}`, { 
            headers: { 'User-Agent': 'Chrome/84.0.4147.135' } 
        });
        if (!html) return data;
        const $ = cheerio.load(html);
        for (let prop of props) {
            const td = $(`span.txt:contains(${prop.replace(/[\[\]]/g, '')})`).parent().next();
            let field = td.find('font,a');
            if (field.length === 0) field = td.find('span.txt');
            data[prop] = this.tryCast(field.text());
        }
        return data;
    }

    tryCast(raw) {
        const text = raw.replace(/\D\W^ /gi, '');
        if (/\d/.test(text) && text.indexOf(',') !== -1) return parseFloat(text.replace(',', '.'));
        if (/\d/.test(text) && text.indexOf(',') === -1) return parseInt(text);
        return text;
    }
}

module.exports = {
    Fundamentus
}
