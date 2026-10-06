const fs = require('fs');

['js/teacher.js', 'js/math-graph-tool.js', 'js/ai-exam-studio.js'].forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`=== ${file} ===`);
    lines.forEach((l, idx) => {
        if (l.match(/function\s+(open|close|toggle)[a-zA-Z0-9_$]*/i) || l.includes('math-graph') || l.includes('graph-modal') || l.includes('mathStudio') || l.includes('MathStudio')) {
            if (l.includes('Modal') || l.includes('modal') || l.includes('Graph') || l.includes('graph')) {
                console.log(`  L${idx+1}: ${l.trim()}`);
            }
        }
    });
});
