const fs = require('fs');

fs.readdirSync('js').forEach(file => {
    if (!file.endsWith('.js')) return;
    const content = fs.readFileSync('js/' + file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((l, idx) => {
        if (l.toLowerCase().includes('bilingual') || l.includes('PresentationPanel') || l.includes('openDictionary') || l.includes('toggleDictionary')) {
            console.log(`js/${file}:L${idx+1}: ${l.trim()}`);
        }
    });
});
