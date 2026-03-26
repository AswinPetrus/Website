const fs = require('fs');
const PDFParser = require("pdf2json");

const personas = [
    { title: 'Plant Head', file: 'plant-head.html', focus: 'Factory Visibility & KPIs' },
    { title: 'Operations Manager', file: 'operations-manager.html', focus: 'Production & WIP Tracking' },
    { title: 'Maintenance Manager', file: 'maintenance-manager.html', focus: 'Condition Monitoring & Uptime' },
    { title: 'Quality Head', file: 'quality-head.html', focus: 'Quality Management & Compliance' },
    { title: 'CIO / CTO', file: 'cio-cto.html', focus: 'IIoT Platform & Secure Architecture' },
    { title: 'ESG Officer', file: 'esg-officer.html', focus: 'Energy & Sustainability Metrics' }
];

function generatePersonaHTML(p) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Petrus Technologies - ${p.title}</title>
    <link rel="stylesheet" href="css/styles.css">
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
                <span>Persona Guide</span>
            </div>
            <h1>${p.title}</h1>
            <p>Intelligence tailored for ${p.focus}.</p>
        </section>

        <section class="glass-panel" style="padding: 4rem; max-width: 900px; margin: 0 auto 5rem auto; text-align: center;">
            <p style="color: var(--text-muted); font-size: 1.1rem; line-height: 1.8;">
                Detailed documentation, case studies, and exact product fits for the <strong>${p.title}</strong> role are currently being finalized. Once the complete PDF mappings are uploaded, this page will automatically aggregate the most critical metrics and modules for ${p.focus}.
            </p>
            <button class="btn-primary" onclick="openContactModal()" style="margin-top: 2rem;">Book a Persona-Specific Tour</button>
        </section>
        
        <section style="margin-bottom: 5rem;">
            <h2 style="font-size: 2rem; margin-bottom: 2rem; text-align: center;">Relevant Calculators for Your Role</h2>
            <input type="hidden" id="persona-filter" value="${p.title === 'CIO / CTO' ? 'CXO' : (p.title.includes('Plant') ? 'Plant' : (p.title.includes('Maintenance') ? 'Mainten' : 'Operator'))}">
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

personas.forEach(p => {
    fs.writeFileSync(p.file, generatePersonaHTML(p));
    console.log(`Generated persona page: ${p.file}`);
});
