const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');
file = file.replace(/for \(let i = 1; i <= 5; i\+\+\) \{/g, 'for (let i = 1; i <= uhCount; i++) {');
fs.writeFileSync('src/pages/GuruPages.tsx', file);
