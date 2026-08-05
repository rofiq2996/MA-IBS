const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const fetchRegex = /status: m\.status,/g;
content = content.replace(fetchRegex, `status: (m.status === 'Terbit' || m.status === 'Sudah Membuat') ? 'Sudah Membuat' : 'Belum Membuat',`);

const saveRegex = /status: editingId \? \(modulList\.find\(m => m\.id === editingId\)\?\.status \|\| 'Sudah Membuat'\) : 'Sudah Membuat',/g;
content = content.replace(saveRegex, `status: 'Terbit', // Save as 'Terbit' in DB`);

fs.writeFileSync(file, content);
console.log('Patched status in GuruPages.tsx');
