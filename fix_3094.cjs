const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(/setLocationError\(null\);\s*\)\}/g, 'setLocationError(null); }}');

fs.writeFileSync('src/pages/GuruPages.tsx', file);
