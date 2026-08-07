const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(/awal: awal \|\| '-',\s*akhir: akhir \|\| '-',\s*uhCount: uhs\.length,/g, "awal: awal || '-',\n          akhir: akhir || '-',");

fs.writeFileSync('src/pages/GuruPages.tsx', file);
