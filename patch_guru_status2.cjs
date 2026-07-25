const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

code = code.replace(
  "status: 'Review',",
  "status: 'Belum Membuat',"
);

fs.writeFileSync('src/pages/GuruPages.tsx', code);
