const fs = require('fs');
const s = fs.readFileSync('js/teacher.js', 'utf8');

const idx = s.indexOf('function aiRegenerateSvgForCurrentQ');
console.log('aiRegenerateSvgForCurrentQ at:', idx);
if (idx !== -1) {
  console.log(s.slice(idx, idx + 1800));
}
