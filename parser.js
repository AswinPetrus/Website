const fs = require('fs');
const PDFParser = require("pdf2json");

console.log("Starting PDF extraction...");

const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    let text = pdfParser.getRawTextContent();
    
    // Fix broken kerning (e.g. "C a l c u l a t o r" -> "Calculator")
    for(let i=0; i<3; i++) {
        text = text.replace(/([a-zA-Z]) ([a-zA-Z])/g, '$1$2');
    }
    
    fs.writeFileSync('clean-pdf.txt', text);
    console.log("Saved clean-pdf.txt. Now parsing 396 items...");
    
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const calculators = [];
    
    let currentCalc = null;
    let captureMode = null;
    
    // Naive heuristic parser for the tabular data
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Match numbers alone, indicating a new row (e.g., "1", "2")
        if (/^\d{1,3}$/.test(line)) {
            if (currentCalc && currentCalc.title) {
                calculators.push(currentCalc);
            }
            currentCalc = { id: 'calc-' + line, title: '', category: 'Production Monitoring', product: 'Production Monitoring', industries: ['Auto', 'FMCG'], personas: ['Operator'], description: '', inputs: [], relations: [], calculateStr: '' };
            
            // Look ahead for title
            if (i+1 < lines.length) currentCalc.title = lines[i+1].replace(/Calculator/i, '').trim() + ' Calculator';
            if (i+2 < lines.length) currentCalc.description = lines[i+2];
            
            continue;
        }
    }
    
    if (currentCalc && currentCalc.title) calculators.push(currentCalc);
    
    fs.writeFileSync('calculators.json', JSON.stringify(calculators, null, 2));
    console.log(`Parsed ${calculators.length} calculators!`);
});

try {
    pdfParser.loadPDF("Calculators Page.pdf");
} catch(e) { console.error(e); }
