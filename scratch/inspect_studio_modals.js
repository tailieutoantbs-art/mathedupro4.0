const fs = require('fs');

const studioJs = fs.readFileSync('js/ai-exam-studio.js', 'utf8');

console.log("=== Matches in ai-exam-studio.js ===");
studioJs.split('\n').forEach((line, idx) => {
    if (line.includes('ai-variation-modal') || line.includes('ai-ocr-modal')) {
        console.log(`js/ai-exam-studio.js:${idx+1}: ${line.trim()}`);
    }
});
