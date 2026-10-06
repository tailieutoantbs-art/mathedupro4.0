const fs = require('fs');

const content = fs.readFileSync('js/math-dictionary.js', 'utf8');
const lines = content.split('\n');
console.log("=== Functions in js/math-dictionary.js ===");
lines.forEach((l, idx) => {
    if (l.includes('function') || l.includes('window.')) {
        console.log(`L${idx+1}: ${l.trim()}`);
    }
});
