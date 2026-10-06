const fs = require('fs');
const path = require('path');

console.log('=== RUNNING DEEP AUDIT ===');

const filesToAudit = [
    'index.html', 'student.html', 'teacher.html', 'bang_trang.html',
    'js/config.js', 'js/portal.js', 'js/student.js', 'js/teacher.js',
    'js/ai-exam-studio.js', 'js/math-curriculum-kntt.js', 'js/math-dictionary.js',
    'js/math-graph-tool.js', 'js/math-id-db.js', 'js/math-render.js',
    'js/i18n.js', 'js/theme.js', 'js/whiteboard.js'
];

// 1. Audit localStorage keys used across JS files
const storageKeys = {};
filesToAudit.filter(f => f.endsWith('.js')).forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const regex = /localStorage\.(?:getItem|setItem|removeItem)\s*\(\s*["']([^"']+)["']/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
        const key = m[1];
        if (!storageKeys[key]) storageKeys[key] = new Set();
        storageKeys[key].add(file);
    }
});

console.log(`\nFound ${Object.keys(storageKeys).length} unique localStorage keys across JS codebase.`);

// 2. Check for missing elements in getElementById across HTML files
const htmlFiles = ['index.html', 'student.html', 'teacher.html', 'bang_trang.html'];
const htmlIdSets = {};

htmlFiles.forEach(hf => {
    const content = fs.readFileSync(hf, 'utf8');
    const ids = new Set();
    const idRegex = /\sid=["']([^"']+)["']/gi;
    let m;
    while ((m = idRegex.exec(content)) !== null) {
        ids.add(m[1]);
    }
    htmlIdSets[hf] = ids;
});

// Map JS files to their primary HTML context
const jsHtmlMap = {
    'js/portal.js': ['index.html'],
    'js/student.js': ['student.html'],
    'js/teacher.js': ['teacher.html'],
    'js/whiteboard.js': ['bang_trang.html'],
    'js/ai-exam-studio.js': ['index.html', 'teacher.html'],
    'js/math-graph-tool.js': ['teacher.html', 'bang_trang.html']
};

console.log('\n=== Checking getElementById calls per HTML context ===');
Object.keys(jsHtmlMap).forEach(jsFile => {
    if (!fs.existsSync(jsFile)) return;
    const code = fs.readFileSync(jsFile, 'utf8');
    const getElemRegex = /document\.getElementById\s*\(\s*["']([^"']+)["']\s*\)/g;
    let m;
    const missingPerHtml = {};
    
    while ((m = getElemRegex.exec(code)) !== null) {
        const id = m[1];
        const targetHtmls = jsHtmlMap[jsFile];
        targetHtmls.forEach(hf => {
            const ids = htmlIdSets[hf];
            if (ids && !ids.has(id)) {
                if (!missingPerHtml[hf]) missingPerHtml[hf] = new Set();
                missingPerHtml[hf].add(id);
            }
        });
    }

    Object.keys(missingPerHtml).forEach(hf => {
        // Filter out IDs created dynamically in JS
        const uncreated = Array.from(missingPerHtml[hf]).filter(id => {
            const createPattern = new RegExp(`id=["'\\\`]?${id}["'\\\`]?|setAttribute\\(['"]id['"],\\s*['"]${id}['"]\\)`);
            return !createPattern.test(code);
        });
        if (uncreated.length > 0) {
            console.log(`[${jsFile} -> ${hf}] Missing ${uncreated.length} static IDs:`, uncreated.slice(0, 10));
        }
    });
});

console.log('\n=== DEEP AUDIT COMPLETED ===');
