const fs = require('fs');

console.log('=== CHECKING UNPROTECTED getElementById PROP ACCESS ===');

const jsFiles = [
    'js/config.js', 'js/portal.js', 'js/student.js', 'js/teacher.js',
    'js/ai-exam-studio.js', 'js/math-curriculum-kntt.js', 'js/math-dictionary.js',
    'js/math-graph-tool.js', 'js/math-id-db.js', 'js/math-render.js',
    'js/i18n.js', 'js/theme.js', 'js/whiteboard.js'
];

jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    // Look for lines like document.getElementById('foo').value or .innerHTML or .classList directly without null check
    const directAccessRegex = /document\.getElementById\s*\(\s*["']([^"']+)["']\s*\)\s*\.(value|innerHTML|innerText|classList|style|addEventListener|focus|click|setAttribute|getAttribute|dataset)\b/g;

    let m;
    while ((m = directAccessRegex.exec(content)) !== null) {
        const id = m[1];
        const prop = m[2];

        // Find line number
        const lineIdx = content.substring(0, m.index).split('\n').length;
        const lineText = lines[lineIdx - 1].trim();

        // Check if guarded by optional chaining (document.getElementById(...)?.prop) or ternary or if
        if (!lineText.includes('?.') && !lineText.startsWith('if') && !lineText.includes('&&')) {
            console.log(`[${file}:${lineIdx}] Potential Direct Property Access on getElementById('${id}').${prop}:`);
            console.log(`   ${lineText.substring(0, 120)}`);
        }
    }
});

console.log('=== CHECKING UNPROTECTED JSON.parse ===');

jsFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    const jsonRegex = /JSON\.parse\s*\(([^)]+)\)/g;
    let m;
    while ((m = jsonRegex.exec(content)) !== null) {
        const expr = m[1];
        const lineIdx = content.substring(0, m.index).split('\n').length;

        // Check surrounding 5 lines for try/catch
        const startLine = Math.max(0, lineIdx - 6);
        const endLine = Math.min(lines.length, lineIdx + 2);
        const context = lines.slice(startLine, endLine).join('\n');

        if (!context.includes('try') && !context.includes('catch')) {
            // Ignore trivial standard strings or simple variables if guarded
            console.log(`[${file}:${lineIdx}] Unprotected JSON.parse(${expr.trim()}): ${lines[lineIdx-1].trim().substring(0, 100)}`);
        }
    }
});
