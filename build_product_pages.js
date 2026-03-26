const fs = require('fs');
const PDFParser = require("pdf2json");

const pages = [
    { pdf: 'Production Monitoring System (PMS).pdf', out: 'pms.html', title: 'Production Monitoring System' },
    { pdf: 'Condition Monitoring System.pdf', out: 'cms.html', title: 'Condition Monitoring System' },
    { pdf: 'Control Tower.pdf', out: 'control-tower.html', title: 'Control Tower' },
    { pdf: 'QMS.pdf', out: 'qms.html', title: 'Quality Management System' },
    { pdf: 'Traceability.pdf', out: 'traceability.html', title: 'Traceability System' },
    { pdf: 'EMS.pdf', out: 'ems.html', title: 'Energy Monitoring System' },
    { pdf: 'Assembly Tracking.pdf', out: 'assembly.html', title: 'Assembly Tracking' }
];

function generateHTML(title, textArray) {
    let contentHtml = '<div class="features-grid" style="margin-top: 2rem;">';
    let currentCardContent = '';
    let isFirstCard = true;

    textArray.forEach(line => {
        if (line.includes('Page (')) return;
        
        // Detect Header
        if (line.match(/^[A-Z0-9\s\&\/\-]+$/) && line.length > 5 && line.length < 60) {
            // Close previous card if it exists
            if (!isFirstCard) {
                contentHtml += `<div class="calc-card glass-panel" style="padding: 2.5rem; text-align: left; height: auto;">${currentCardContent}</div>`;
            }
            isFirstCard = false;
            currentCardContent = `<h3 style="margin-bottom: 1.5rem; color: var(--primary-purple); font-size: 1.5rem;">${line}</h3>`;
        } else if (line.trim().length > 0) {
            if (line.startsWith('•') || line.startsWith('-')) {
                currentCardContent += `<li style="margin-bottom: 0.8rem; margin-left: 1.5rem; color: var(--text-muted); line-height: 1.6;">${line.replace(/^[•\-]\s*/, '')}</li>`;
            } else {
                currentCardContent += `<p style="margin-bottom: 1.2rem; line-height: 1.7; color: var(--text-muted);">${line}</p>`;
            }
        }
    });

    // Close the very last card
    if (currentCardContent.length > 0) {
        contentHtml += `<div class="calc-card glass-panel" style="padding: 2.5rem; text-align: left; height: auto;">${currentCardContent}</div>`;
    }
    contentHtml += '</div>';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Petrus Technologies - ${title}</title>
    <link rel="stylesheet" href="./styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        .hero { min-height: 40vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .hero h1 { font-size: 3.5rem; max-width: 900px; margin-bottom: 1rem; }
        .hero p { font-size: 1.2rem; color: var(--text-muted); max-width: 700px; margin-bottom: 2rem; }
    </style>
</head>
<body>
    <main class="container" style="padding-top: 8rem;">
        <section class="hero">
            <div class="badge glass-badge" style="margin-bottom: 2rem;">
                <span>Product Module</span>
            </div>
            <h1>${title}</h1>
            <p>Intelligence tailored for your manufacturing needs.</p>
        </section>

        <section class="glass-panel" style="padding: 4rem; max-width: 900px; margin: 0 auto 5rem auto;">
            ${contentHtml}
        </section>
        
        <section style="margin-bottom: 5rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem;">
                <div>
                    <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Relevant Calculators</h2>
                    <p style="color: var(--text-muted);">See the ROI of this module instantly.</p>
                </div>
                <button class="btn-primary" onclick="window.location.href='calculators.html'" style="padding: 0.6rem 1.5rem; font-size: 0.9rem;">View All Calculators</button>
            </div>
            
            <input type="hidden" id="product-filter" value="${title}">
            <div class="calculators-grid" id="main-grid"></div>
        </section>

    </main>

    <!-- Modal for Calculator -->
    <div class="modal-overlay" id="calc-modal">
        <div class="modal-content glass-panel popup-anim">
            <button class="close-btn" onclick="closeCalculator()">&times;</button>
            <div class="modal-header">
                <span class="badge" id="modal-category" style="margin-bottom: 1rem;">Category</span>
                <h2 id="modal-title">Calculator Title</h2>
            </div>
            <div class="modal-split">
                <div>
                    <p id="modal-desc" class="calc-description">Description goes here.</p>
                    <div class="inputs-grid" id="modal-inputs"></div>
                </div>
                <div class="calc-results-section">
                    <div class="chart-container glass-panel-inner" id="result-container">
                        <canvas id="result-chart"></canvas>
                        <div style="position: absolute; text-align: center; pointer-events: none;">
                            <div style="font-size: 0.9rem; color: var(--text-muted);">Result</div>
                            <div class="result-value text-gradient" id="result-value">--</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <h4>Explore Related Calculators</h4>
                <div class="related-pills" id="modal-related"></div>
            </div>
        </div>
    </div>

    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="./js/app.js"></script>
    <script src="js/components.js"></script>
</body>
</html>`;
}

pages.forEach(page => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
        let text = pdfParser.getRawTextContent();
        for (let i=0; i<3; i++) {
            text = text.replace(/([a-zA-Z]) ([a-zA-Z])/g, '$1$2');
        }
        const lines = text.split('\\n').map(l => l.trim()).filter(l => l.length > 0);
        const html = generateHTML(page.title, lines);
        fs.writeFileSync(page.out, html);
        console.log(`Generated ${page.out} successfully.`);
    });
    try {
        pdfParser.loadPDF(`Website Structure/${page.pdf}`);
    } catch(e) {
        console.error("Error loading PDF", page.pdf);
    }
});

// Create Placeholders for Industries and Manufacturing Types
fs.writeFileSync('industries.html', generateHTML('Based on Industries', ['Detailed industries page coming soon once the final PDF is provided.']));
fs.writeFileSync('manufacturing.html', generateHTML('Manufacturing Types', ['Detailed manufacturing types page coming soon once the final PDF is provided.']));
