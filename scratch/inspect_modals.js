const fs = require('fs');

const portalCode = fs.readFileSync('js/portal.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

console.log("=== Modal functions defined in js/portal.js ===");
const fnMatches = portalCode.match(/function\s+[a-zA-Z0-9_$]*Modal[a-zA-Z0-9_$]*\s*\([^)]*\)/g);
if (fnMatches) console.log(Array.from(new Set(fnMatches)));

console.log("\n=== Modal element IDs in index.html ===");
const idMatches = indexHtml.match(/id=["']([^"']*modal[^"']*)["']/gi);
if (idMatches) console.log(Array.from(new Set(idMatches)));
