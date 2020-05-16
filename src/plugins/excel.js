import { Workbook } from 'exceljs';
import fs from 'file-saver';

function exportExcel(name, headers, content) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(name);

    worksheet.columns = headers;
    worksheet.addRows(content);

    workbook.xlsx.writeBuffer()
        .then(function (buffer) {
            fs.saveAs(
                new Blob([buffer], { type: "application/octet-stream" }),
                `${name}.xlsx`
            );
        });
}

export default {
    export: exportExcel
}