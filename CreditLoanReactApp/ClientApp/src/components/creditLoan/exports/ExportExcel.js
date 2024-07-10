import React from 'react';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';


const ExportExcel = ({ excelData, fileName, disabled }) => {

    //const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileType2 = 'application/octet-stream';
    const fileExtension = '.xlsx';
    const handleExportExcel = async () => {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'data');;
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType2 });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <button className="btn btn-outline-primary" onClick={(e) => handleExportExcel(fileName)} disabled={disabled}>
            <i className="fa fa-table"></i>&nbsp;Export Excel
        </button>
    );
}

export default ExportExcel;