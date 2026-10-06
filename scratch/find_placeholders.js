const fs = require('fs');
const tmpl = fs.readFileSync('scratch/prompt1_template.txt', 'utf8');

const matches = tmpl.match(/\{\{[A-Z0-9_]+\}\}/g);
console.log('Unique placeholders in template:', [...new Set(matches)]);
