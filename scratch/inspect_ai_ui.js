const fs = require('fs');
const s = fs.readFileSync('js/teacher.js', 'utf8');

const target = 'ai-prompt-grade';
let idx = 0;
while ((idx = s.indexOf(target, idx)) !== -1) {
  console.log('--- FOUND AT:', idx, '---');
  console.log(s.slice(Math.max(0, idx - 150), Math.min(s.length, idx + 1500)));
  idx += target.length;
}
