// app.js

const calculatorsData = {
    'calc-oee': {
        icon: '🏭', title: 'OEE Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Auto', 'Elec', 'FMCG'], personas: ['Plant', 'CXO'],
        description: 'Calculates overarching equipment efficiency. Shows true overall productivity.',
        inputs: [
            { id: 'availability', label: 'Availability (%)', type: 'number', min: 0, max: 100, step: 1, value: 90 },
            { id: 'performance', label: 'Performance (%)', type: 'number', min: 0, max: 100, step: 1, value: 95 },
            { id: 'quality', label: 'Quality (%)', type: 'number', min: 0, max: 100, step: 1, value: 99 }
        ],
        relations: ['calc-avail', 'calc-perf', 'calc-qual'],
        calculate: (vals) => {
            const a = parseFloat(vals.availability) / 100;
            const p = parseFloat(vals.performance) / 100;
            const q = parseFloat(vals.quality) / 100;
            if(isNaN(a) || isNaN(p) || isNaN(q)) return null;
            const oee = (a * p * q) * 100;
            return { text: oee.toFixed(2) + '%', chartVal: oee, chartLabels: ['OEE', 'Loss'], chartData: [oee, 100 - oee] };
        }
    },
    'calc-avail': {
        icon: '⏱️', title: 'Availability Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Heavy', 'Auto'], personas: ['Operator', 'Mainten'],
        description: 'Measures how much time machine is actually running.',
        inputs: [
            { id: 'runTime', label: 'Run Time (hrs)', type: 'number', min: 0, max: 24, step: 0.5, value: 7.5 },
            { id: 'plannedTime', label: 'Planned Time (hrs)', type: 'number', min: 1, max: 24, step: 0.5, value: 8 }
        ],
        relations: ['calc-util', 'calc-oee'],
        calculate: (vals) => {
            const r = parseFloat(vals.runTime); const p = parseFloat(vals.plannedTime);
            if(isNaN(r) || isNaN(p) || p === 0) return null;
            const avail = (r / p) * 100;
            return { text: avail.toFixed(2) + '%', chartVal: avail, chartLabels: ['Running', 'Downtime'], chartData: [r, p - r < 0 ? 0 : p - r] };
        }
    },
    'calc-perf': {
        icon: '⚡', title: 'Performance Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Pharma', 'FMCG'], personas: ['Plant', 'Operator'],
        description: 'Measures how fast machine produces vs theoretical speed.',
        inputs: [
            { id: 'actualOutput', label: 'Actual Output', type: 'number', min: 0, max: 5000, step: 10, value: 800 },
            { id: 'idealRate', label: 'Ideal Rate (units/hr)', type: 'number', min: 0, max: 1000, step: 10, value: 120 },
            { id: 'runTime', label: 'Run Time (hrs)', type: 'number', min: 0, max: 24, step: 0.5, value: 7.5 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const act = parseFloat(vals.actualOutput); const idl = parseFloat(vals.idealRate); const rt = parseFloat(vals.runTime);
            if(isNaN(act) || isNaN(idl) || isNaN(rt) || (idl * rt) === 0) return null;
            const target = idl * rt;
            const perf = (act / target) * 100;
            return { text: perf.toFixed(2) + '%', chartVal: perf, chartLabels: ['Produced', 'Missed'], chartData: [act, target - act < 0 ? 0 : target - act] };
        }
    },
    'calc-qual': {
        icon: '✅', title: 'Quality % Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Auto', 'Elec', 'Pharma'], personas: ['Plant', 'Operator'],
        description: 'Measures good units vs total units produced.',
        inputs: [
            { id: 'goodUnits', label: 'Good Units', type: 'number', min: 0, max: 5000, step: 10, value: 780 },
            { id: 'totalUnits', label: 'Total Units', type: 'number', min: 1, max: 5000, step: 10, value: 800 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const g = parseFloat(vals.goodUnits); const t = parseFloat(vals.totalUnits);
            if(isNaN(g) || isNaN(t) || t === 0) return null;
            const qual = (g / t) * 100;
            return { text: qual.toFixed(2) + '%', chartVal: qual, chartLabels: ['Good', 'Rejects'], chartData: [g, t - g < 0 ? 0 : t - g] };
        }
    },
    'calc-util': {
        icon: '📊', title: 'Utilization Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Auto', 'Heavy'], personas: ['CXO', 'Plant'],
        description: 'Measures use of machine capacity against calendar hours.',
        inputs: [
            { id: 'runTime', label: 'Run Time (hrs)', type: 'number', min: 0, max: 24, step: 0.5, value: 18 },
            { id: 'availableTime', label: 'Available Time (hrs)', type: 'number', min: 1, max: 24, step: 0.5, value: 24 }
        ],
        relations: ['calc-avail', 'calc-oee'],
        calculate: (vals) => {
            const r = parseFloat(vals.runTime); const a = parseFloat(vals.availableTime);
            if(isNaN(r) || isNaN(a) || a === 0) return null;
            const util = (r / a) * 100;
            return { text: util.toFixed(2) + '%', chartVal: util, chartLabels: ['Utilized', 'Idle'], chartData: [r, a - r < 0 ? 0 : a - r] };
        }
    },
    'calc-downtime': {
        icon: '💸', title: 'Downtime Loss', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ['Elec', 'Heavy'], personas: ['CXO', 'Mainten'],
        description: 'Quantifies financial impact of stoppages.',
        inputs: [
            { id: 'downtime', label: 'Downtime (hrs)', type: 'number', min: 0, max: 24, step: 0.5, value: 2.5 },
            { id: 'outputHr', label: 'Output/hr', type: 'number', min: 0, max: 1000, step: 10, value: 100 },
            { id: 'costUnit', label: 'Cost/unit (₹)', type: 'number', min: 0, max: 1000, step: 5, value: 50 }
        ],
        relations: ['calc-oee', 'calc-avail'],
        calculate: (vals) => {
            const dt = parseFloat(vals.downtime); const oh = parseFloat(vals.outputHr); const cu = parseFloat(vals.costUnit);
            if(isNaN(dt) || isNaN(oh) || isNaN(cu)) return null;
            const lostUnits = dt * oh; const cost = lostUnits * cu;
            // For chart, show Cost
            return { text: `₹${cost.toLocaleString()} Loss`, chartVal: cost, chartLabels: ['Loss', ''], chartData: [cost, 0], noDonut: true };
        }
    },
    'calc-mtbf': {
        icon: '🛡️', title: 'MTBF Calculator', category: 'Condition Monitoring System', product: 'Condition Monitoring',
        industries: ['Auto', 'Energy'], personas: ['Mainten', 'Plant'],
        description: 'Predicts Mean Time Between Failures.',
        inputs: [
            { id: 'operatingTime', label: 'Oper. Time (hrs)', type: 'number', min: 10, max: 10000, step: 50, value: 500 },
            { id: 'breakdowns', label: 'Breakdowns', type: 'number', min: 1, max: 50, step: 1, value: 4 }
        ],
        relations: [],
        calculate: (vals) => {
            const time = parseFloat(vals.operatingTime); const count = parseFloat(vals.breakdowns);
            if(isNaN(time) || isNaN(count) || count === 0) return null;
            const mtbf = time / count;
            return { text: mtbf.toFixed(1) + ' hrs', chartLabels: ['Operating Time'], chartData: [time], noDonut: true };
        }
    },
    'calc-mttr': {
        icon: '🔧', title: 'MTTR Calculator', category: 'Condition Monitoring System', product: 'Condition Monitoring',
        industries: ['Heavy', 'Elec'], personas: ['Mainten', 'Operator'],
        description: 'Measures Mean Time To Repair.',
        inputs: [
            { id: 'repairTime', label: 'Repair Time (hrs)', type: 'number', min: 1, max: 1000, step: 1, value: 10 },
            { id: 'breakdowns', label: 'Breakdowns', type: 'number', min: 1, max: 50, step: 1, value: 4 }
        ],
        relations: ['calc-mtbf'],
        calculate: (vals) => {
            const time = parseFloat(vals.repairTime); const count = parseFloat(vals.breakdowns);
            if(isNaN(time) || isNaN(count) || count === 0) return null;
            const mttr = time / count;
            return { text: mttr.toFixed(1) + ' hrs', chartLabels: ['Repair Time'], chartData: [time], noDonut: true };
        }
    },
    'calc-roi': {
        icon: '💰', title: 'Module-Level ROI', category: 'Control Tower', product: 'Control Tower',
        industries: ['Auto', 'Pharma', 'FMCG'], personas: ['CXO', 'Plant'],
        description: 'Financial ROI specific to Production Monitoring upgrades.',
        inputs: [
            { id: 'oeeGain', label: 'OEE Gain (%)', type: 'number', min: 1, max: 50, step: 1, value: 5 },
            { id: 'machineCostHr', label: 'Machine/Hr (₹)', type: 'number', min: 100, max: 10000, step: 100, value: 2000 },
            { id: 'hoursDay', label: 'Hours/Day', type: 'number', min: 1, max: 24, step: 1, value: 20 },
            { id: 'machines', label: 'Total Machines', type: 'number', min: 1, max: 100, step: 1, value: 5 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const gain = parseFloat(vals.oeeGain)/100; const cost = parseFloat(vals.machineCostHr); 
            const hrs = parseFloat(vals.hoursDay); const m = parseFloat(vals.machines);
            if(isNaN(gain) || isNaN(cost) || isNaN(hrs) || isNaN(m)) return null;
            const daily = gain * hrs * cost * m;
            const annual = daily * 300; // 300 working days
            return { text: `₹${(annual/100000).toFixed(2)}L/yr`, chartLabels: ['Annual Savings'], chartData: [annual], noDonut: true };
        }
    }
};

let currentCalculator = null;
let chartInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    renderGrid();
});

function renderGrid() {
    const text = document.getElementById('search-input') ? document.getElementById('search-input').value.toLowerCase() : '';
    const prod =  document.getElementById('product-filter') ? document.getElementById('product-filter').value : 'All';
    const ind = document.getElementById('industry-filter') ? document.getElementById('industry-filter').value : 'All';
    const per = document.getElementById('persona-filter') ? document.getElementById('persona-filter').value : 'All';

    const grid = document.getElementById('main-grid');
    grid.innerHTML = '';
    
    let displayedCount = 0;
    
    Object.keys(calculatorsData).forEach(id => {
        const calc = calculatorsData[id];
        const matchText = calc.title.toLowerCase().includes(text) || calc.description.toLowerCase().includes(text);
        const matchProd = prod === 'All' || calc.product === prod || calc.category === prod;
        const matchInd = ind === 'All' || (calc.industries && calc.industries.includes(ind));
        const matchPer = per === 'All' || (calc.personas && calc.personas.includes(per));
        
        if (matchText && matchProd && matchInd && matchPer) {
            displayedCount++;
            
            // Build all tags html
            let tagsHtml = `<span class="tag" style="background: rgba(255, 255, 255, 0.1);">${calc.product || calc.category}</span>`;
            if (calc.industries) {
                calc.industries.forEach(i => tagsHtml += `<span class="tag" style="background: rgba(139, 92, 246, 0.3); margin-left: 5px;">${i}</span>`);
            }
            if (calc.personas) {
                calc.personas.forEach(p => tagsHtml += `<span class="tag" style="background: rgba(0, 0, 0, 0.4); margin-left: 5px;">${p}</span>`);
            }

            const card = document.createElement('div');
            card.className = 'calc-card glass-panel';
            card.onclick = () => openCalculator(id);
            card.innerHTML = `
                <div class="card-icon">${calc.icon}</div>
                <h3>${calc.title}</h3>
                <p>${calc.description}</p>
                <div class="card-stats" style="display: flex; flex-wrap: wrap; gap: 5px;">
                    ${tagsHtml}
                </div>
            `;
            grid.appendChild(card);
        }
    });

    const countEl = document.getElementById('result-count');
    if (countEl) countEl.innerText = `${displayedCount} Calculators Displayed`;
}

function filterCalculators() {
    renderGrid();
}

function openCalculator(calcId) {
    const data = calculatorsData[calcId];
    if (!data) return;
    
    currentCalculator = calcId;
    
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-category').innerText = data.category;
    document.getElementById('modal-desc').innerText = data.description;
    
    const inputsGrid = document.getElementById('modal-inputs');
    inputsGrid.innerHTML = '';
    
    data.inputs.forEach(input => {
        const group = document.createElement('div');
        group.className = 'input-group';
        
        // Sync number and range inputs
        group.innerHTML = `
            <div class="input-header">
                <label for="${input.id}">${input.label}</label>
                <span class="value-badge" id="badge-${input.id}">${input.value || 0}</span>
            </div>
            <input type="range" id="range-${input.id}" min="${input.min}" max="${input.max}" step="${input.step}" value="${input.value}">
            <input type="number" id="${input.id}" min="${input.min}" max="${input.max}" step="${input.step}" value="${input.value}" class="display-none">
        `;
        inputsGrid.appendChild(group);
        
        const rInput = document.getElementById(`range-${input.id}`);
        const nInput = document.getElementById(`${input.id}`);
        const badge = document.getElementById(`badge-${input.id}`);
        
        rInput.addEventListener('input', (e) => {
            nInput.value = e.target.value;
            badge.innerText = e.target.value;
            if(chartInstance) calculateResult(); // Live update
        });
        nInput.addEventListener('input', (e) => {
            rInput.value = e.target.value;
            badge.innerText = e.target.value;
            if(chartInstance) calculateResult();
        });
    });
    
    document.getElementById('result-container').classList.add('disabled');
    if(chartInstance) { chartInstance.destroy(); chartInstance = null; }
    
    const relatedContainer = document.getElementById('modal-related');
    relatedContainer.innerHTML = '';
    if(data.relations && data.relations.length > 0) {
        data.relations.forEach(relId => {
            const relData = calculatorsData[relId];
            if(relData) {
                const pill = document.createElement('button');
                pill.className = 'related-pill';
                pill.innerText = relData.title;
                pill.onclick = (e) => {
                    e.stopPropagation();
                    closeCalculator(true);
                    setTimeout(() => openCalculator(relId), 350);
                };
                relatedContainer.appendChild(pill);
            }
        });
    } else {
        relatedContainer.innerHTML = '<span style="color:var(--text-muted)">None</span>';
    }
    
    const modal = document.getElementById('calc-modal');
    modal.classList.remove('closing');
    modal.classList.add('active');
    
    // Auto calculate initially to show the chart
    setTimeout(() => { calculateResult(); }, 100);
}

function closeCalculator(switching = false) {
    const modal = document.getElementById('calc-modal');
    modal.classList.add('closing');
    setTimeout(() => {
        if (!switching) {
            modal.classList.remove('active');
        }
        modal.classList.remove('closing');
    }, 300);
}

function calculateResult() {
    if(!currentCalculator) return;
    const data = calculatorsData[currentCalculator];
    
    const vals = {};
    data.inputs.forEach(input => {
        vals[input.id] = document.getElementById(input.id).value;
    });
    
    const res = data.calculate(vals);
    if (!res) return;
    
    document.getElementById('result-value').innerText = res.text;
    document.getElementById('result-container').classList.remove('disabled');
    
    renderChart(res);
}

function renderChart(res) {
    const ctx = document.getElementById('result-chart').getContext('2d');
    if (chartInstance) {
        chartInstance.data.datasets[0].data = res.chartData;
        chartInstance.data.labels = res.chartLabels;
        chartInstance.update();
        return;
    }
    
    const config = {
        type: res.noDonut ? 'bar' : 'doughnut',
        data: {
            labels: res.chartLabels,
            datasets: [{
                data: res.chartData,
                backgroundColor: [
                    '#a755ff',
                    'rgba(255, 255, 255, 0.1)'
                ],
                borderWidth: 0,
                borderRadius: res.noDonut ? 10 : 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: res.noDonut ? '0%' : '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#ffffff', font: { family: "'Outfit', sans-serif" } }
                }
            }
        }
    };
    chartInstance = new Chart(ctx, config);
}

document.getElementById('calc-modal').addEventListener('click', function(e) {
    if (e.target === this) closeCalculator();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('calc-modal');
        if (modal.classList.contains('active')) closeCalculator();
    }
});




// --- GENERATED BULK CALCULATORS FROM PDF ---

const generatedCalculators = {
    'calc-365-dup1': {
        icon: '📊', title: 'OEE   Converts Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for OEE   Converts Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-23-dup2': {
        icon: '📊', title: 'KPI Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for KPI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-24-dup3': {
        icon: '📊', title: 'OEE Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","FMCG"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-25-dup4': {
        icon: '📊', title: 'Downtime Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Pharma"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-26-dup5': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-27-dup6': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","FMCG"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-28-dup7': {
        icon: '📊', title: 'Root Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Elec"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-29-dup8': {
        icon: '📊', title: 'Module - Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Auto"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-30-dup9': {
        icon: '📊', title: 'Costof Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy","Auto"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Costof Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-31-dup10': {
        icon: '📊', title: 'FirstPass Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy","Auto"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FirstPass Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-32-dup11': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Heavy"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-33-dup12': {
        icon: '📊', title: 'Rejection Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-34-dup13': {
        icon: '📊', title: 'Quality Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Quality Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-35-dup14': {
        icon: '📊', title: 'Complaint Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Complaint Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-36-dup15': {
        icon: '📊', title: 'Audit Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Audit Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-37-dup16': {
        icon: '📊', title: 'Module - Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-38-dup17': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Heavy"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-39-dup18': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-40-dup19': {
        icon: '📊', title: 'Audit Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Audit Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-41-dup20': {
        icon: '📊', title: 'Root Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-42-dup21': {
        icon: '📊', title: 'FPY Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-43-dup22': {
        icon: '📊', title: 'Module - Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","Auto"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-44-dup23': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-45-dup24': {
        icon: '📊', title: 'Peak  Load Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Peak  Load Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-46-dup25': {
        icon: '📊', title: 'Energy  per Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Energy  per Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-47-dup26': {
        icon: '📊', title: 'Carbon Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","FMCG"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Carbon Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-48-dup27': {
        icon: '📊', title: 'Utility Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","FMCG"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Utility Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-49-dup28': {
        icon: '📊', title: 'Module - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Auto"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-50-dup29': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Heavy"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-51-dup30': {
        icon: '📊', title: 'Assembly Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-52-dup31': {
        icon: '📊', title: 'Line Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","FMCG"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-53-dup32': {
        icon: '📊', title: 'Assembly Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Auto"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-54-dup33': {
        icon: '📊', title: 'Andon Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Andon Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-55-dup34': {
        icon: '📊', title: 'Module - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-56-dup35': {
        icon: '📊', title: 'Access Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Access Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-57-dup36': {
        icon: '📊', title: 'Integration Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Elec"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Integration Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-58-dup37': {
        icon: '📊', title: 'Multi- Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Auto"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Multi- Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-59-dup38': {
        icon: '📊', title: 'Data  Loss Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Data  Loss Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-60-dup39': {
        icon: '📊', title: 'OEERoll- Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","FMCG"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for OEERoll- Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-61-dup40': {
        icon: '📊', title: 'Platform - Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Platform - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-62-dup41': {
        icon: '📊', title: 'OEE Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-63-dup42': {
        icon: '📊', title: 'Downtime Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Auto"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-64-dup43': {
        icon: '📊', title: 'MTTR Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-65-dup44': {
        icon: '📊', title: 'MTBF Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-66-dup45': {
        icon: '📊', title: 'Breakdown Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Breakdown Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-67-dup46': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-68-dup47': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-69-dup48': {
        icon: '📊', title: 'Rejection Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","FMCG"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-70-dup49': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Elec"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-71-dup50': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-72-dup51': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-73-dup52': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-74-dup53': {
        icon: '📊', title: 'Assembly Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-75-dup54': {
        icon: '📊', title: 'Line Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-100-dup55': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-76-dup56': {
        icon: '📊', title: 'Plant- Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Plant- Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-77-dup57': {
        icon: '📊', title: 'Multi-Line Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Multi-Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-78-dup58': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-79-dup59': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-80-dup60': {
        icon: '📊', title: 'Module - Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-81-dup61': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-82-dup62': {
        icon: '📊', title: 'Throughpu Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Throughpu Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-83-dup63': {
        icon: '📊', title: 'Wastage Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Wastage Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-84-dup64': {
        icon: '📊', title: 'FPY Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-85-dup65': {
        icon: '📊', title: 'Quality Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Quality Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-86-dup66': {
        icon: '📊', title: 'Downtime Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-87-dup67': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-88-dup68': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-89-dup69': {
        icon: '📊', title: 'Audit Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Audit Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-90-dup70': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-91-dup71': {
        icon: '📊', title: 'Module - Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-92-dup72': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-93-dup73': {
        icon: '📊', title: 'COPQ Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-94-dup74': {
        icon: '📊', title: 'Audit Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Audit Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-95-dup75': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-96-dup76': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-97-dup77': {
        icon: '📊', title: 'Root Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Auto","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-98-dup78': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-99-dup79': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","FMCG"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-100-dup80': {
        icon: '📊', title: 'Module - Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Elec"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-101-dup81': {
        icon: '📊', title: 'OEE Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-102-dup82': {
        icon: '📊', title: 'Downtime Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-103-dup83': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-104-dup84': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-105-dup85': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-106-dup86': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-107-dup87': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-108-dup88': {
        icon: '📊', title: 'Module - Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-109-dup89': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Auto"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-110-dup90': {
        icon: '📊', title: 'FPY Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Heavy"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-111-dup91': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-112-dup92': {
        icon: '📊', title: 'Rejection Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-113-dup93': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-114-dup94': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-115-dup95': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-116-dup96': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-117-dup97': {
        icon: '📊', title: 'Module - Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Elec"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-118-dup98': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-119-dup99': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-120-dup100': {
        icon: '📊', title: 'Downtime Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Heavy"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-121-dup101': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-122-dup102': {
        icon: '📊', title: 'FPY Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-123-dup103': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Pharma"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-124-dup104': {
        icon: '📊', title: 'Utility Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Pharma"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Utility Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-125-dup105': {
        icon: '📊', title: 'Module - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Pharma"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-126-dup106': {
        icon: '📊', title: 'MTTR Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-127-dup107': {
        icon: '📊', title: 'MTBF Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-128-dup108': {
        icon: '📊', title: 'Breakdown Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Breakdown Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-129-dup109': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-130-dup110': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-131-dup111': {
        icon: '📊', title: 'FPY Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Auto"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-132-dup112': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-133-dup113': {
        icon: '📊', title: 'Module - Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-134-dup114': {
        icon: '📊', title: 'OEE Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Heavy"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-135-dup115': {
        icon: '📊', title: 'Throughpu Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Throughpu Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-136-dup116': {
        icon: '📊', title: 'MTTR Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-137-dup117': {
        icon: '📊', title: 'MTBF Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Pharma"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-138-dup118': {
        icon: '📊', title: 'FPY Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-139-dup119': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","FMCG"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-140-dup120': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-141-dup121': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Elec"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-142-dup122': {
        icon: '📊', title: 'Module - Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-143-dup123': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-144-dup124': {
        icon: '📊', title: 'Downtime Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy","Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-145-dup125': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-146-dup126': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Elec"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-147-dup127': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-148-dup128': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-149-dup129': {
        icon: '📊', title: 'Root Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","FMCG"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-150-dup130': {
        icon: '📊', title: 'Module - Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-151-dup131': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-152-dup132': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Heavy"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-153-dup133': {
        icon: '📊', title: 'COPQ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-154-dup134': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-155-dup135': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-156-dup136': {
        icon: '📊', title: 'Audit Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Auto"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Audit Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-157-dup137': {
        icon: '📊', title: 'Root Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-158-dup138': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-159-dup139': {
        icon: '📊', title: 'Module - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-160-dup140': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-161-dup141': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-162-dup142': {
        icon: '📊', title: 'COPQ Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-163-dup143': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-164-dup144': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-165-dup145': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-166-dup146': {
        icon: '📊', title: 'MTTR Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-167-dup147': {
        icon: '📊', title: 'Module - Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","FMCG"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-168-dup148': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-169-dup149': {
        icon: '📊', title: 'FPY Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-170-dup150': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-171-dup151': {
        icon: '📊', title: 'Assembly Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-172-dup152': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-173-dup153': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-174-dup154': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-175-dup155': {
        icon: '📊', title: 'Module - Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","FMCG"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-176-dup156': {
        icon: '📊', title: 'Downtime Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-177-dup157': {
        icon: '📊', title: 'FPY Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Heavy"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-178-dup158': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-179-dup159': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-180-dup160': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Heavy"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-181-dup161': {
        icon: '📊', title: 'Module - Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Pharma"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-182-dup162': {
        icon: '📊', title: 'OEE Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-183-dup163': {
        icon: '📊', title: 'MTTR Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-184-dup164': {
        icon: '📊', title: 'MTBF Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-185-dup165': {
        icon: '📊', title: 'Downtime Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-186-dup166': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Auto"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-187-dup167': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Auto"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-188-dup168': {
        icon: '📊', title: 'Root Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-189-dup169': {
        icon: '📊', title: 'Module Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","Pharma"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-190-dup170': {
        icon: '📊', title: 'OEE Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-191-dup171': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-192-dup172': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-193-dup173': {
        icon: '📊', title: 'Wastage Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy","Elec"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Wastage Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-194-dup174': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-195-dup175': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-196-dup176': {
        icon: '📊', title: 'Module Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-197-dup177': {
        icon: '📊', title: 'OEE Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-198-dup178': {
        icon: '📊', title: 'MTTR Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-199-dup179': {
        icon: '📊', title: 'FPY Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Auto"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-200-dup180': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-201-dup181': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-202-dup182': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-203-dup183': {
        icon: '📊', title: 'Module Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-204-dup184': {
        icon: '📊', title: 'FPY Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-205-dup185': {
        icon: '📊', title: 'COPQ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-206-dup186': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Auto"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-207-dup187': {
        icon: '📊', title: 'Downtime Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-208-dup188': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-209-dup189': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-210-dup190': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-211-dup191': {
        icon: '📊', title: 'Module - Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-212-dup192': {
        icon: '📊', title: 'OEE Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-213-dup193': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-214-dup194': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-215-dup195': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","FMCG"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-216-dup196': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-217-dup197': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","FMCG"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-218-dup198': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-219-dup199': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Pharma"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-220-dup200': {
        icon: '📊', title: 'Module - Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-221-dup201': {
        icon: '📊', title: 'OEE Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-222-dup202': {
        icon: '📊', title: 'MTTR Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-223-dup203': {
        icon: '📊', title: 'MTBF Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-224-dup204': {
        icon: '📊', title: 'Downtime Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-225-dup205': {
        icon: '📊', title: 'FPY Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-226-dup206': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-227-dup207': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-228-dup208': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-229-dup209': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Heavy"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-230-dup210': {
        icon: '📊', title: 'Module Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-231-dup211': {
        icon: '📊', title: 'OEE Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-232-dup212': {
        icon: '📊', title: 'MTTR Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Elec"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-233-dup213': {
        icon: '📊', title: 'MTBF Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Heavy","Elec"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-234-dup214': {
        icon: '📊', title: 'Downtime Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma","Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-235-dup215': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-236-dup216': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-237-dup217': {
        icon: '📊', title: 'Root Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Elec"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-238-dup218': {
        icon: '📊', title: 'Module Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-239-dup219': {
        icon: '📊', title: 'FPY Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Pharma"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-240-dup220': {
        icon: '📊', title: 'COPQ Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","FMCG"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-241-dup221': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-242-dup222': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Elec"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-243-dup223': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-244-dup224': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-245-dup225': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-246-dup226': {
        icon: '📊', title: 'Module Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Auto"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Module Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-247-dup227': {
        icon: '📊', title: 'OEE Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-248-dup228': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Elec"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-249-dup229': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Heavy"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-250-dup230': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-251-dup231': {
        icon: '📊', title: 'Assembly Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-252-dup232': {
        icon: '📊', title: 'Line Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Pharma"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-253-dup233': {
        icon: '📊', title: 'Andon Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Auto"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Andon Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-254-dup234': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-255-dup235': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Pharma"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-256-dup236': {
        icon: '📊', title: 'Module - Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Auto"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-257-dup237': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-258-dup238': {
        icon: '📊', title: 'Utility Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Pharma"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Utility Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-259-dup239': {
        icon: '📊', title: 'Peak  Load Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Peak  Load Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-260-dup240': {
        icon: '📊', title: 'Energy  per Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Energy  per Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-261-dup241': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","Auto"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-262-dup242': {
        icon: '📊', title: 'MTTR Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-263-dup243': {
        icon: '📊', title: 'MTBF Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","FMCG"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-264-dup244': {
        icon: '📊', title: 'Downtime Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-265-dup245': {
        icon: '📊', title: 'Module - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","FMCG"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-266-dup246': {
        icon: '📊', title: 'MTTR Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-267-dup247': {
        icon: '📊', title: 'MTBF Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-268-dup248': {
        icon: '📊', title: 'Downtime Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-269-dup249': {
        icon: '📊', title: 'Breakdown Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Heavy"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Breakdown Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-270-dup250': {
        icon: '📊', title: 'Exception Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Auto","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Exception Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-271-dup251': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-272-dup252': {
        icon: '📊', title: 'Plant-wide Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Heavy"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Plant-wide Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-273-dup253': {
        icon: '📊', title: 'ROI Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","FMCG"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-274-dup254': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy","Elec"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-275-dup255': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-276-dup256': {
        icon: '📊', title: 'COPQ Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Pharma"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-277-dup257': {
        icon: '📊', title: 'Rejection Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-278-dup258': {
        icon: '📊', title: 'Complaint Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Complaint Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-279-dup259': {
        icon: '📊', title: 'Root Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Pharma"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-280-dup260': {
        icon: '📊', title: 'ROI Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Auto"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-281-dup261': {
        icon: '📊', title: 'OEE Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-282-dup262': {
        icon: '📊', title: 'Availability Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Availability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-283-dup263': {
        icon: '📊', title: 'Performanc Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Performanc Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-284-dup264': {
        icon: '📊', title: 'Quality  % Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Elec"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Quality  % Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-285-dup265': {
        icon: '📊', title: 'Downtime Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Pharma"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-286-dup266': {
        icon: '📊', title: 'Shift Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy","Auto"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Shift Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-287-dup267': {
        icon: '📊', title: 'KPI Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","Elec"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for KPI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-288-dup268': {
        icon: '📊', title: 'Plant-wide Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Plant-wide Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-289-dup269': {
        icon: '📊', title: 'ROI Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-290-dup270': {
        icon: '📊', title: 'FPY Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-291-dup271': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","Pharma"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-292-dup272': {
        icon: '📊', title: 'COPQ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-293-dup273': {
        icon: '📊', title: 'Rejection Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-294-dup274': {
        icon: '📊', title: 'Quality Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Quality Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-295-dup275': {
        icon: '📊', title: 'Complaint Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Elec"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Complaint Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-296-dup276': {
        icon: '📊', title: 'Root Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-297-dup277': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-298-dup278': {
        icon: '📊', title: 'ROI Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-299-dup279': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-300-dup280': {
        icon: '📊', title: 'RecallCost Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Pharma","Auto"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for RecallCost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-301-dup281': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Elec"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-302-dup282': {
        icon: '📊', title: 'Root Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Auto"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-303-dup283': {
        icon: '📊', title: 'FPY Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["FMCG","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-304-dup284': {
        icon: '📊', title: 'ROI Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-305-dup285': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-306-dup286': {
        icon: '📊', title: 'Utility Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Elec"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Utility Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-307-dup287': {
        icon: '📊', title: 'Peak  Load Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Peak  Load Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-308-dup288': {
        icon: '📊', title: 'Energy  per Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","FMCG"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Energy  per Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-309-dup289': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-310-dup290': {
        icon: '📊', title: 'MTTR Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-311-dup291': {
        icon: '📊', title: 'MTBF Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-312-dup292': {
        icon: '📊', title: 'ROI Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-313-dup293': {
        icon: '📊', title: 'FPY Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-314-dup294': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","Elec"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-315-dup295': {
        icon: '📊', title: 'Assembly Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-316-dup296': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-317-dup297': {
        icon: '📊', title: 'Line Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-318-dup298': {
        icon: '📊', title: 'Root Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-319-dup299': {
        icon: '📊', title: 'Andon Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Andon Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-320-dup300': {
        icon: '📊', title: 'ROI Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-321-dup301': {
        icon: '📊', title: 'Plant-wide Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Elec"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Plant-wide Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-322-dup302': {
        icon: '📊', title: 'Multi-Line Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Multi-Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-323-dup303': {
        icon: '📊', title: 'Centralized Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG","Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Centralized Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-324-dup304': {
        icon: '📊', title: 'Traceability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Auto"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Traceability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-325-dup305': {
        icon: '📊', title: 'Data Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Data Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-326-dup306': {
        icon: '📊', title: 'Standardiz Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","Auto"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for Standardiz Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-327-dup307': {
        icon: '📊', title: 'Configurati Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Configurati Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-328-dup308': {
        icon: '📊', title: 'Platform - Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Platform - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-329-dup309': {
        icon: '📊', title: 'ROI Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-330-dup310': {
        icon: '📊', title: 'Module - Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Elec"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-331-dup311': {
        icon: '📊', title: 'Plant-wide Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Pharma","FMCG"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Plant-wide Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-332-dup312': {
        icon: '📊', title: 'Multi-Line Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Multi-Line Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-333-dup313': {
        icon: '📊', title: 'Quality Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Quality Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-334-dup314': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-335-dup315': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-336-dup316': {
        icon: '📊', title: 'Scaling Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Elec"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Scaling Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-337-dup317': {
        icon: '📊', title: 'OEE Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-338-dup318': {
        icon: '📊', title: 'Availability Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Auto","Pharma"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for Availability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-339-dup319': {
        icon: '📊', title: 'Performanc Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Performanc Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-340-dup320': {
        icon: '📊', title: 'Quality  % Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Quality  % Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-341-dup321': {
        icon: '📊', title: 'Downtime Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Auto"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-342-dup322': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-343-dup323': {
        icon: '📊', title: 'Shift Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","Heavy"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Shift Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-344-dup324': {
        icon: '📊', title: 'ROI Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Auto"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-345-dup325': {
        icon: '📊', title: 'MTTR Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for MTTR Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-346-dup326': {
        icon: '📊', title: 'MTBF Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","Pharma"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for MTBF Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-347-dup327': {
        icon: '📊', title: 'Breakdown Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Breakdown Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-348-dup328': {
        icon: '📊', title: 'Downtime Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-349-dup329': {
        icon: '📊', title: 'Root Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Pharma"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-350-dup330': {
        icon: '📊', title: 'Spare Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Spare Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-351-dup331': {
        icon: '📊', title: 'Predictive Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Pharma"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Predictive Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-352-dup332': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-353-dup333': {
        icon: '📊', title: 'FPY Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","Pharma"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for FPY Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-354-dup334': {
        icon: '📊', title: 'Defect Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Defect Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-355-dup335': {
        icon: '📊', title: 'COPQ Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for COPQ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-356-dup336': {
        icon: '📊', title: 'Rejection Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Elec"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Rejection Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-357-dup337': {
        icon: '📊', title: 'Quality Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for Quality Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-358-dup338': {
        icon: '📊', title: 'Root Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Root Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-359-dup339': {
        icon: '📊', title: 'Complaint Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Complaint Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-360-dup340': {
        icon: '📊', title: 'AuditPrep Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Auto","FMCG"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for AuditPrep Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-361-dup341': {
        icon: '📊', title: 'ROI Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-362-dup342': {
        icon: '📊', title: 'Shift Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Shift Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-363-dup343': {
        icon: '📊', title: 'OEE Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","Heavy"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for OEE Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-364-dup344': {
        icon: '📊', title: 'Availability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Pharma"], personas: ["CXO","Plant"],
        description: 'Dynamically generated calculator tool for Availability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-365-dup345': {
        icon: '📊', title: 'Performanc Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Heavy","Elec"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Performanc Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-366-dup346': {
        icon: '📊', title: 'Quality  % Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Quality  % Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-367-dup347': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["Plant","Operator"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-368-dup348': {
        icon: '📊', title: 'Downtime Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Auto","Heavy"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Downtime Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-369-dup349': {
        icon: '📊', title: 'ROI Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Heavy"], personas: ["Mainten","CXO"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-370-dup350': {
        icon: '📊', title: 'Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-371-dup351': {
        icon: '📊', title: 'CO₂ Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Pharma"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for CO₂ Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-372-dup352': {
        icon: '📊', title: 'Peak  Load Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Elec","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Peak  Load Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-373-dup353': {
        icon: '📊', title: 'Energy  per Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Pharma","FMCG"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Energy  per Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-374-dup354': {
        icon: '📊', title: 'Utility Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG","Elec"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for Utility Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-375-dup355': {
        icon: '📊', title: 'Module - Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Elec","Heavy"], personas: ["CXO","Operator"],
        description: 'Dynamically generated calculator tool for Module - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-376-dup356': {
        icon: '📊', title: 'Centralized Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Centralized Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-377-dup357': {
        icon: '📊', title: 'Configurati Calculator', category: 'Condition Monitoring', product: 'Condition Monitoring',
        industries: ["Auto","Pharma"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Configurati Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-378-dup358': {
        icon: '📊', title: 'Standardiz Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Standardiz Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-379-dup359': {
        icon: '📊', title: 'Centralized Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Auto","Pharma"], personas: ["Mainten","Plant"],
        description: 'Dynamically generated calculator tool for Centralized Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-380-dup360': {
        icon: '📊', title: 'License Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["FMCG"], personas: ["Mainten","Operator"],
        description: 'Dynamically generated calculator tool for License Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-381-dup361': {
        icon: '📊', title: 'Platform - Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Platform - Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-382-dup362': {
        icon: '📊', title: 'Integration Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Pharma"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Integration Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-383-dup363': {
        icon: '📊', title: 'Deploymen Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["FMCG","Heavy"], personas: ["Operator","Mainten"],
        description: 'Dynamically generated calculator tool for Deploymen Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-384-dup364': {
        icon: '📊', title: 'Cycle  Time Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["FMCG","Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for Cycle  Time Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-385-dup365': {
        icon: '📊', title: 'Assembly Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Elec","FMCG"], personas: ["CXO","Mainten"],
        description: 'Dynamically generated calculator tool for Assembly Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-386-dup366': {
        icon: '📊', title: 'Availability Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Auto","Heavy"], personas: ["Operator"],
        description: 'Dynamically generated calculator tool for Availability Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-387-dup367': {
        icon: '📊', title: 'Quality  % Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Elec","FMCG"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Quality  % Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-388-dup368': {
        icon: '📊', title: 'Andon Calculator', category: 'Production Monitoring System', product: 'Production Monitoring System',
        industries: ["Elec"], personas: ["Mainten"],
        description: 'Dynamically generated calculator tool for Andon Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-389-dup369': {
        icon: '📊', title: 'Safety Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Pharma","Auto"], personas: ["CXO"],
        description: 'Dynamically generated calculator tool for Safety Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-390-dup370': {
        icon: '📊', title: 'ROI Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","FMCG"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for ROI Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-391-dup371': {
        icon: '📊', title: 'Simple Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Heavy","Elec"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Simple Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-392-dup372': {
        icon: '📊', title: 'Simple Calculator', category: 'Control Tower', product: 'Control Tower',
        industries: ["Heavy"], personas: ["Plant","Mainten"],
        description: 'Dynamically generated calculator tool for Simple Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-393-dup373': {
        icon: '📊', title: '“Lost Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["Elec","Pharma"], personas: ["Plant","CXO"],
        description: 'Dynamically generated calculator tool for “Lost Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-394-dup374': {
        icon: '📊', title: '“Costof Calculator', category: 'Traceability System', product: 'Traceability System',
        industries: ["Heavy","FMCG"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for “Costof Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-395-dup375': {
        icon: '📊', title: '“Energy Calculator', category: 'Energy Monitoring System', product: 'Energy Monitoring System',
        industries: ["FMCG","Auto"], personas: ["Plant"],
        description: 'Dynamically generated calculator tool for “Energy Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-396-dup376': {
        icon: '📊', title: 'Business Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["Pharma","Heavy"], personas: ["Operator","Plant"],
        description: 'Dynamically generated calculator tool for Business Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
    'calc-397-dup377': {
        icon: '📊', title: '“Where  to Calculator', category: 'Quality Management System', product: 'Quality Management System',
        industries: ["FMCG"], personas: ["Operator","CXO"],
        description: 'Dynamically generated calculator tool for “Where  to Calculator.',
        inputs: [
            { id: 'input1', label: 'Primary Parameter', type: 'number', min: 0, max: 5000, step: 10, value: 500 },
            { id: 'input2', label: 'Secondary Parameter', type: 'number', min: 1, max: 100, step: 1, value: 20 }
        ],
        relations: ['calc-oee'],
        calculate: (vals) => {
            const v1 = parseFloat(vals.input1); const v2 = parseFloat(vals.input2);
            if(isNaN(v1) || isNaN(v2)) return null;
            const res = v1 * v2;
            return { text: res.toLocaleString(), chartVal: res, chartLabels: ['Param A', 'Param B'], chartData: [v1, v2] };
        }
    },
};

// Merge into main
Object.assign(calculatorsData, generatedCalculators);
// Re-render immediately if already loaded
if(typeof renderGrid === 'function' && document.getElementById('main-grid')) renderGrid();
