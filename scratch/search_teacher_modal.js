const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html')).concat(
    fs.readdirSync('./js').map(f => 'js/' + f)
);

console.log("=== Searching for 'teacher-login-modal' or 'TeacherLogin' or 'openTeacherLogin' ===");
files.forEach(f => {
    if (fs.existsSync(f)) {
        const text = fs.readFileSync(f, 'utf8');
        text.split('\n').forEach((line, i) => {
            if (line.includes('teacher-login-modal') || line.includes('TeacherLoginModal')) {
                console.log(`${f}:${i+1}: ${line.trim()}`);
            }
        });
    }
});
