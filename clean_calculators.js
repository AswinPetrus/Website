const fs = require('fs');

let html = fs.readFileSync('calculators.html', 'utf8');

// Remove original nav
html = html.replace(/<nav class="navbar glass-panel">[\s\S]*?<\/nav>/, '');
// Remove original background orbs
html = html.replace(/<div class="background-orbs">[\s\S]*?<\/div>\s*/, '');
// Insert the script right before </body>
html = html.replace('</body>', '    <script src="js/components.js"></script>\n</body>');

fs.writeFileSync('calculators.html', html);
console.log('Cleaned calculators.html');
