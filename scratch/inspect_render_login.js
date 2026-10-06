const fs = require('fs');

const portalJs = fs.readFileSync('js/portal.js', 'utf8');

console.log("=== Matches in portal.js for 'renderPortalLoginScreen' ===");
portalJs.split('\n').forEach((line, idx) => {
    if (line.includes('renderPortalLoginScreen')) {
        console.log(`js/portal.js:${idx+1}: ${line.trim()}`);
    }
});
