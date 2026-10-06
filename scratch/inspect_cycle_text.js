const fs = require('fs');

const portalJs = fs.readFileSync('js/portal.js', 'utf8');

console.log("=== Matches in portal.js for 'leaderboard-cycle-text' ===");
portalJs.split('\n').forEach((line, idx) => {
    if (line.includes('leaderboard-cycle-text')) {
        console.log(`js/portal.js:${idx+1}: ${line.trim()}`);
    }
});
