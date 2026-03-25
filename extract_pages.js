const fs = require('fs');
const PDFParser = require("pdf2json");

function parsePDF(filepath, outputpath) {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        let text = pdfParser.getRawTextContent();
        for (let i=0; i<3; i++) {
            text = text.replace(/([a-zA-Z]) ([a-zA-Z])/g, '$1$2');
        }
        fs.writeFileSync(outputpath, text);
        console.log(`Parsed ${filepath} -> ${outputpath}`);
    });
    pdfParser.loadPDF(filepath);
}

parsePDF('Website Structure/IIOT Home.pdf', 'home-content.txt');
parsePDF('Website Structure/New to IIoT_.pdf', 'new-to-iiot-content.txt');
