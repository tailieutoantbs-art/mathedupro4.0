const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const portalJs = fs.readFileSync('js/portal.js', 'utf8');

console.log("=== Matches in index.html for 'Giáo viên' or 'giáo viên' or 'teacher' ===");
indexHtml.split('\n').forEach((line, idx) => {
    if (line.toLowerCase().includes('giáo viên') || line.toLowerCase().includes('teacher')) {
        console.log(`index.html:${idx+1}: ${line.trim()}`);
    }
});

console.log("\n=== Matches in portal.js for 'openTeacher' or 'Teacher' modal triggers ===");
portalJs.split('\n').forEach((line, idx) => {
    if (line.includes('teacher-login-pin') || line.includes('openTeacherLoginModal') || line.includes('openTeacher')) {
        console.log(`js/portal.js:${idx+1}: ${line.trim()}`);
    }
});
