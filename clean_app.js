const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');
const tag = '// --- GENERATED BULK CALCULATORS FROM PDF ---';
if (code.includes(tag)) {
    code = code.substring(0, code.indexOf(tag));
    fs.writeFileSync('js/app.js', code);
    console.log("Cleaned app.js successfully.");
} else {
    console.log("No previous bulk block found.");
}
