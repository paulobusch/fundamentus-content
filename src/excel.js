const Excel = require('exceljs');

class ExcelWrapper {
    constructor(path, worksheetName) {
        this.path = path;
        this.worksheetName = worksheetName;
    }

    async headers() {
        const columns = [];
        for (let c = 1; c <= this.worksheet.columns.length; c++) {
            const name = this.getCellValue(1, c);
            if (!name || !/\[.*?\]/.test(name)) continue;
            columns.push(name);
        }
        return columns;
    }

    async read() {
        const rows = [];
        this.workbook = new Excel.Workbook();
        await this.workbook.xlsx.readFile(this.path);
        this.worksheet = this.workbook.worksheets.find(w => w.name === this.worksheetName);
        if (!this.worksheet) throw new Error(`Nenhuma planilha com o nome: ${this.worksheetName}`);
        const columns = await this.headers();
        const recursive = (rowNumber) => {
            let row = new Object();
            if (!this.getCellValue(rowNumber, 1)) return;
            for (let column of columns){
                const columnNumber = columns.indexOf(column) + 1;
                row[column] = this.getCellValue(rowNumber, columnNumber);
            }
            rows.push(row);
            recursive(rowNumber + 1);
        };
        recursive(2);
        return { columns, rows };
    }

    async save(columns, rows) {
        let rowNumber = 2;
        for (let row of rows) {
            let columnNumber = 1;
            for (let column of columns) {
                const cellValue = row[column];
                const cell = this.worksheet.getCell(rowNumber, columnNumber);
                cell.value = cellValue;
                columnNumber++;
            }
            rowNumber++;
        }
        try {
            await this.workbook.xlsx.writeFile(this.path);
        } catch {
            throw new Error('Falha ao gravar a planilha');
        }
    }

    getCellValue(row, column) {
        const { value } = this.worksheet.getCell(row, column);
        return value 
            ? value.toString().trim()
            : null;
    }
}

module.exports = {
    ExcelWrapper
}
