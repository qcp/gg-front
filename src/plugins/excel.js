import { Workbook } from "exceljs";
import fs from "file-saver";

function exportExcel(name, headers, content) {
  let workbook = new Workbook();
  let worksheet = workbook.addWorksheet(name);

  worksheet.columns = headers;
  worksheet.addRows(content);

  workbook.xlsx.writeBuffer().then(function(buffer) {
    fs.saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `${name}.xlsx`
    );
  });
}

async function importExcel(file, hadHeaders) {
  let workbook = new Workbook();
  await workbook.xlsx.load(await new Response(file).arrayBuffer());
  let table = [];
  let headers = [];
  const worksheet = workbook.getWorksheet(1);
  worksheet.eachRow((row, rowNumber) => {
    if (hadHeaders && rowNumber === 1) {
      headers = row.values;
      return;
    }
    let entry = {};
    for (let i = 0; i < row.values.length; i++) {
      entry[hadHeaders ? headers[i] : i.toString()] = row.values[i];
    }
    table.push(entry);
  });
  return table;
}

export default {
  export: exportExcel,
  import: importExcel
};
