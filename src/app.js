const { Excel } = require('./excel');
const { Fundamentus } = require('./fundamentus');

class App {
    constructor(config) {
        this.config = config;
    }

    run() {
        const excel = new Excel(this.config.Excel.Path);
        const data = excel.read(this.config.Excel.Columns);
        if (data == null) throw new Error("Planilha inválida");
        const api = new Fundamentus(this.config.Fundamentus.Url);
        data.rows = api.queryList(data.rows, excel.headers());
        excel.save(result);
    }
}

module.exports = { 
    App
}
