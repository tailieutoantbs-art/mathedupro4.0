const fs = require('fs');
const files = [
    'index.html', 'student.html', 'teacher.html', 'bang_trang.html',
    'js/portal.js', 'js/teacher.js', 'js/student.js', 'js/whiteboard.js',
    'js/ai-exam-studio.js', 'js/config.js', 'js/math-render.js', 'js/math-graph-tool.js'
];

const symbols = [
    'closeTeacherLoginModal',
    'openMathStudioModal',
    'toggleBilingualPresentationPanel',
    'btn-submit-teacher-pin',
    'closeInfographicViewer'
];

symbols.forEach(sym => {
    console.log(`=== Symbol: ${sym} ===`);
    files.forEach(f => {
        if (fs.existsSync(f)) {
            const content = fs.readFileSync(f, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, idx) => {
                if (line.includes(sym)) {
                    console.log(`  ${f}:${idx+1}: ${line.trim()}`);
                }
            });
        }
    });
});
