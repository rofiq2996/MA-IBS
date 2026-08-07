const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(/\}\)\}/g, '}))}');

fs.writeFileSync('src/pages/GuruPages.tsx', file);
