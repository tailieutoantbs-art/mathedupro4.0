const fs = require('fs');

const portalCode = fs.readFileSync('js/portal.js', 'utf8');

console.log("=== Matches in js/portal.js for 'loginWithPin' or 'loginWithGoogle' ===");
portalCode.split('\n').forEach((l, i) => {
    if (l.includes('loginWithPin') || l.includes('loginWithGoogle') || l.includes('openTeacher')) {
        console.log(`js/portal.js:${i+1}: ${l.trim()}`);
    }
});
