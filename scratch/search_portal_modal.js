const fs = require('fs');

const portalCode = fs.readFileSync('js/portal.js', 'utf8');
const lines = portalCode.split('\n');

console.log("=== Matches in js/portal.js for 'teacher-login-modal' or 'Teacher' ===");
lines.forEach((line, idx) => {
    if (line.includes('teacher-login-modal') || line.toLowerCase().includes('teacherlogin')) {
        console.log(`L${idx+1}: ${line.trim()}`);
    }
});
