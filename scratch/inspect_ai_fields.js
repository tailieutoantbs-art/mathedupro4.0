const fs = require('fs');
const html = fs.readFileSync('teacher.html', 'utf8');

const idx = html.indexOf('view-import-ai');
const endIdx = html.indexOf('view-import-paste');
const slice = html.slice(idx, endIdx);

const textareas = slice.match(/<textarea[^>]*>/g);
console.log('Textareas in view-import-ai:', textareas);

const ids = [...slice.matchAll(/id=[\"']([^\"']+)[\"']/g)].map(m => m[1]);
console.log('All IDs in view-import-ai:', ids);
