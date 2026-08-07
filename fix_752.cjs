const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');
let lines = file.split('\n');

lines[751] = lines[751].replace(/\}\)\)\}/g, '})}');

fs.writeFileSync('src/pages/GuruPages.tsx', lines.join('\n'));
