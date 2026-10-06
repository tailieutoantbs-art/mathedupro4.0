const fs = require('fs');

const studentJs = fs.readFileSync('js/student.js', 'utf8');

console.log("=== Matches in student.js ===");
studentJs.split('\n').forEach((line, idx) => {
    if (line.includes('btn-header-hamburger') || line.includes('result-modal')) {
        console.log(`js/student.js:${idx+1}: ${line.trim()}`);
    }
});
