const fs = require('fs');

const portalCode = fs.readFileSync('js/portal.js', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

console.log("=== References in portal.js ===");
portalCode.split('\n').forEach((l, i) => {
    if (l.includes('teacher-login-modal') || l.includes('openTeacher') || l.includes('closeTeacher')) {
        console.log(`js/portal.js:${i+1}: ${l.trim()}`);
    }
});

console.log("\n=== References in index.html ===");
indexHtml.split('\n').forEach((l, i) => {
    if (l.includes('teacher-login-modal') || l.includes('openTeacher') || l.includes('closeTeacher')) {
        console.log(`index.html:${i+1}: ${l.trim()}`);
    }
});
