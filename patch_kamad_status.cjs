const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Replace global text replacing
code = code.replace(/item\.status === 'Terbit'/g, "item.status === 'Sudah Membuat'");
code = code.replace(/item\.status === 'Review'/g, "item.status === 'Belum Membuat'");

code = code.replace(/selectedMateri\.status === 'Terbit'/g, "selectedMateri.status === 'Sudah Membuat'");
code = code.replace(/selectedMateri\.status === 'Review'/g, "selectedMateri.status === 'Belum Membuat'");

code = code.replace(/newStatus: 'Terbit' \| 'Review'/g, "newStatus: 'Sudah Membuat' | 'Belum Membuat'");

code = code.replace(
  /'Terbit \/ Siap Pembelajaran' : 'Dalam Proses \/ Draf'/g,
  "'Sudah Membuat' : 'Belum Membuat'"
);

code = code.replace(
  /'Terbit \/ Siap' : 'Draf \/ Proses'/g,
  "'Sudah Membuat' : 'Belum Membuat'"
);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
