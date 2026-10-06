const fs = require('fs');

const portalJs = fs.readFileSync('js/portal.js', 'utf8');

console.log("=== Matches in portal.js for 'teacherLoginBtn' ===");
portalJs.split('\n').forEach((line, idx) => {
    if (line.includes('teacherLoginBtn') || line.includes('openTeacherLoginModal')) {
        console.log(`js/portal.js:${idx+1}: ${line.trim()}`);
    }
});
