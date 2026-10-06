const fs = require('fs');
const s = fs.readFileSync('js/teacher.js', 'utf8');

const idx = s.indexOf('function setAiPromptMode');
console.log('setAiPromptMode at:', idx);
console.log(s.slice(idx, idx + 1200));
