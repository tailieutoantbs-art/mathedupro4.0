const fs = require('fs');

['bang_trang.html', 'js/whiteboard.js'].forEach(file => {
    if (!fs.existsSync(file)) return;
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    console.log(`=== ${file} ===`);
    lines.forEach((l, idx) => {
        if (l.toLowerCase().includes('bilingual') || l.toLowerCase().includes('clil') || l.includes('PresentationPanel') || l.includes('bilingual-board-btn')) {
            console.log(`  L${idx+1}: ${l.trim()}`);
        }
    });
});
