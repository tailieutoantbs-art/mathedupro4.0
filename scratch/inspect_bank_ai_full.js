const fs = require('fs');
const s = fs.readFileSync('js/teacher.js', 'utf8');

const idx = s.indexOf('function generateBankAiPrompt()');
console.log('generateBankAiPrompt at:', idx);
console.log(s.slice(idx, idx + 2500));
