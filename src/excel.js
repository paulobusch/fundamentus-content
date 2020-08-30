const Excel = require('exceljs');

class ExcelWrapper {
    constructor(path) {
        this.path = path;
    }

    async checkLoaded() {
        if (this.worksheet) return;
        const workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(this.path);
        this.worksheet = workbook.worksheets[0];
    }

    async headers() {
        const columns = [];
        await this.checkLoaded();
        for (let c = 1; c <= this.worksheet.columns.length; c++)
            columns.push(this.getCellValue(1, c));
        return columns;
    }

    async read() {
        const rows = [];
        const columns = await this.headers();
        await this.checkLoaded();
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

    async save(data) {

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
