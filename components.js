document.addEventListener("DOMContentLoaded", () => {
    // Inject Background Orbs
    const orbs = document.createElement('div');
    orbs.className = 'background-orbs';
    orbs.innerHTML = `
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
    `;
    document.body.insertBefore(orbs, document.body.firstChild);

    // Inject Strict Navigation Bar
    const nav = document.createElement('nav');
    nav.className = 'navbar glass-panel';
    nav.innerHTML = `
        <div class="logo-container">
            <h2 class="text-logo" style="margin: 0; cursor: pointer;" onclick="window.location.href='index.html'">Petrus Technologies</h2>
        </div>
        <ul class="nav-links">
            <!-- STRICT 4 ITEMS ONLY -->
            <li class="dropdown">
                <a href="#">Products</a>
                <ul class="dropdown-menu">
                    <li><a href="pms.html">Production Monitoring System</a></li>
                    <li><a href="cms.html">Condition Monitoring System</a></li>
                    <li><a href="control-tower.html">Control Tower</a></li>
                    <li><a href="qms.html">Quality Management System</a></li>
                    <li><a href="traceability.html">Traceability System</a></li>
                    <li><a href="ems.html">Energy Monitoring System</a></li>
                    <li><a href="assembly.html">Assembly Tracking</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="industries.html">Industries</a>
                <ul class="dropdown-menu">
                    <li><a href="industries.html">Automotive</a></li>
                    <li><a href="industries.html">Pharma & Lifesciences</a></li>
                    <li><a href="industries.html">FMCG</a></li>
                    <li><a href="industries.html">Electronics</a></li>
                    <li><a href="industries.html">Heavy Engineering</a></li>
                </ul>
            </li>
            <li class="dropdown">
                <a href="manufacturing.html">Manufacturing Types</a>
                <ul class="dropdown-menu">
                    <li><a href="manufacturing.html">Discrete</a></li>
                    <li><a href="manufacturing.html">Process</a></li>
                    <li><a href="manufacturing.html">Batch</a></li>
                    <li><a href="manufacturing.html">Assembly Line</a></li>
                </ul>
            </li>
            <li><a href="#" onclick="openContactModal(event); return false;">Digital Transformation Consultation</a></li>
        </ul>
        <button class="btn-primary" onclick="openContactModal()">Book Demo</button>
    `;
    document.body.insertBefore(nav, document.body.children[1]);

    // Inject Footer
    const footer = document.createElement('footer');
    footer.style.cssText = "border-top: 1px solid rgba(255,255,255,0.1); margin-top: 6rem; padding: 4rem 2rem 2rem 2rem; background: rgba(0,0,0,0.5); backdrop-filter: blur(10px);";
    footer.innerHTML = `
        <div class="container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem; margin-bottom: 3rem;">
            <div>
                <h2 class="text-logo" style="font-size: 1.5rem; margin-bottom: 1rem;">Petrus Technologies</h2>
                <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.6;">Empowering manufacturing with intelligence. Headquarters in Coimbatore, India.</p>
                <div style="margin-top: 1.5rem;">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">📞 +91 422 350 9900</p>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">✉️ info@petrustechnologies.com</p>
                    <p style="margin-top: 1rem;"><a href="https://in.linkedin.com/company/petrus-technologies" target="_blank" style="color: var(--primary-purple); text-decoration: none;">LinkedIn Profile</a></p>
                </div>
            </div>
            <div>
                <h4 style="margin-bottom: 1.5rem; font-family: var(--font-heading);">Products</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="pms.html" style="color: var(--text-muted); text-decoration: none;">Production Monitoring</a></li>
                    <li><a href="qms.html" style="color: var(--text-muted); text-decoration: none;">Quality Management</a></li>
                    <li><a href="control-tower.html" style="color: var(--text-muted); text-decoration: none;">Control Tower</a></li>
                    <li><a href="ems.html" style="color: var(--text-muted); text-decoration: none;">Energy Monitoring</a></li>
                </ul>
            </div>
            <div>
                <h4 style="margin-bottom: 1.5rem; font-family: var(--font-heading);">Quick Links</h4>
                <ul style="list-style: none; padding: 0; line-height: 2;">
                    <li><a href="industries.html" style="color: var(--text-muted); text-decoration: none;">Based on Industries</a></li>
                    <li><a href="manufacturing.html" style="color: var(--text-muted); text-decoration: none;">Manufacturing Types</a></li>
                    <li><a href="calculators.html" style="color: var(--text-muted); text-decoration: none;">IIoT Calculators</a></li>
                    <li><a href="new-to-iiot.html" style="color: var(--text-muted); text-decoration: none;">Beginner's Guide</a></li>
                </ul>
            </div>
        </div>
        <div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; margin-top: 2rem;">
            &copy; ${new Date().getFullYear()} Petrus Technologies Pvt Ltd. All rights reserved.
        </div>
    `;
    document.body.appendChild(footer);

    // Inject Contact/Book Demo Modal
    const modalHTML = `
    <div class="modal-overlay" id="contact-modal" style="z-index: 2000;">
        <div class="modal-content glass-panel popup-anim" style="max-width: 500px;">
            <button class="close-btn" onclick="closeContactModal()">&times;</button>
            <div class="modal-header" style="text-align: center;">
                <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">Book Demo / Consulting</h2>
                <p style="color: var(--text-muted);">Schedule a tailored tour or request digital transformation consulting.</p>
            </div>
            <div class="modal-body">
                <div class="inputs-grid" style="gap: 1rem;">
                    <div class="input-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="John Doe">
                    </div>
                    <div class="input-group">
                        <label>Corporate Email</label>
                        <input type="text" placeholder="john@company.com">
                    </div>
                    <div class="input-group">
                        <label>Company / Plant</label>
                        <input type="text" placeholder="Acme Manufacturing">
                    </div>
                    <div class="input-group">
                        <label>What's your biggest challenge?</label>
                        <input type="text" placeholder="e.g. High downtime, quality rejects...">
                    </div>
                </div>
                <button class="btn-primary calc-submit" onclick="alert('Demo Request Sent! Our team will contact you shortly.')" style="margin-top: 1.5rem;">Submit Request</button>
                <div style="text-align: center; margin-top: 2rem;">
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Or reach us directly:</p>
                    <p style="color: white; font-size: 1.1rem; font-weight: bold; margin-top: 0.5rem;">📞 +91 422 350 9900</p>
                </div>
            </div>
        </div>
    </div>`;

    // Create elements from HTML string and append
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper.firstElementChild);
});

// Global functions for Contact Modal
window.openContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (modal) modal.classList.add('active');
};
window.closeContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.remove('active', 'closing');
        }, 300);
    }
};
