class Fundamentus {
    constructor(url) {
        this.url = url;
    }

    queryList(codes, props) {
        const list = [];
        for (let code of codes)
            list.push(this.queryOne(code, props));
        return list;
    }

    queryOne(code, props) {
        return {  };
    }
}

module.exports = {
    Fundamentus
}
