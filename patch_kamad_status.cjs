const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KamadPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const fetchRegex = /status: m\.status,/g;
content = content.replace(fetchRegex, `status: (m.status === 'Terbit' || m.status === 'Sudah Membuat') ? 'Sudah Membuat' : 'Belum Membuat',`);

const fetchDashRegex = /completedMateri: materiData\.filter\(\(m: any\) => m\.status === 'Sudah Membuat'\)\.length/g;
content = content.replace(fetchDashRegex, `completedMateri: materiData.filter((m: any) => m.status === 'Terbit' || m.status === 'Sudah Membuat').length`);

fs.writeFileSync(file, content);
console.log('Patched status in KamadPages.tsx');
