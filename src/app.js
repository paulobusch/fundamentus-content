const { ExcelWrapper } = require('./excel');
const { Fundamentus } = require('./fundamentus');

class App {
    constructor(config) {
        this.config = config;
    }

    async run() {
        console.log('Iniciando leitura');
        const columnCode = this.config.Excel.Columns.code;
        const excel = new ExcelWrapper(this.config.Excel.Path, this.config.Excel.Worksheet);
        const { rows, columns } = await excel.read();
        if (columns.indexOf(columnCode) === -1) 
            throw new Error("A Planilha deve ter a coluna: " + columnCode);
        if (rows.length === 0)
            throw new Error("A Planilha deve ter alguma ação para consulta");
        const api = new Fundamentus(this.config.Fundamentus.Url);
        let counter = 1;
        for (let row of rows) {
            const code = row[columnCode];
            console.log(`Consultando: ${code} | ${counter} / ${rows.length}`);
            const data = await api.readData(code, columns);
            data[columnCode] = code;
            for (let column of columns)
                row[column] = data[column] || ' - ';
            counter++;
        }
        await excel.save(columns, rows);
        console.log('Fim');
    }
}

module.exports = { 
    App
}
