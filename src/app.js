const { Excel } = require('./excel');
const { Fundamentus } = require('./fundamentus');

class App {
    constructor(config) {
        this.config = config;
    }

    async run() {
        console.log('Iniciando leitura');
        const excel = new Excel(this.config.Excel.Path);
        const data = await excel.read(this.config.Excel.Columns);
        if (data == null) throw new Error("Planilha inválida");
        const api = new Fundamentus(this.config.Fundamentus.Url);
        const headers = excel.headers();
        let counter = 1;
        for (let row of data.rows) {
            const { code } = row;
            console.log(`Consultando: ${code} | ${counter} / ${row.length}`);
            const result = await api.query(code, headers);
            for (let header of headers)
                row[header] = result[header] || ' - ';
            counter++;
        }
        await excel.save(result);
        console.log('Fim');
    }
}

module.exports = { 
    App
}
