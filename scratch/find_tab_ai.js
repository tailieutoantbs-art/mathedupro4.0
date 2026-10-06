const fs = require('fs');
const s = fs.readFileSync('js/teacher.js', 'utf8');

const target = 'tab === \'ai\'';
const idx = s.indexOf(target);
console.log('tab === ai at:', idx);
console.log(s.slice(Math.max(0, idx - 3000), idx + 100));
