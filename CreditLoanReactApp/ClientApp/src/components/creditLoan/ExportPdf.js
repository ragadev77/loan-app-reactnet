import React from 'react';
import JsPDF from "jspdf";

const ExportPdf = ({ controlId, fileName }) => {

    console.log(controlId);
    const handleExportPdf = async () => {
        const report = new JsPDF('portrait', 'pt', 'a4');

        //todo : controlId as param on querySelector
        report.html(document.querySelector('#detailData'))
            .then(() => { report.save({fileName}+'.pdf'); });

} //end const

    return (
        <button className="btn btn-pdf" onClick={ (e) => handleExportPdf(fileName) } ><i className="fa fa-file-pdf-o"></i>&nbsp;Export Pdf</button>
    );
}

export default ExportPdf;