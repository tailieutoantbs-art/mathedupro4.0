const fs = require('fs');

const teacherJs = fs.readFileSync('js/teacher.js', 'utf8');

console.log("=== Matches in teacher.js ===");
teacherJs.split('\n').forEach((line, idx) => {
    if (line.includes('submitChangeTeacherPin') || line.includes('btn-submit-teacher-pin') || line.includes('change-pin')) {
        console.log(`js/teacher.js:${idx+1}: ${line.trim()}`);
    }
});
