const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

code = code.replace(
  "status: 'Terbit' | 'Review';",
  "status: 'Sudah Membuat' | 'Belum Membuat';"
);

code = code.replace(
  "status: 'Terbit',\n    driveUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing',",
  "status: 'Sudah Membuat',\n    driveUrl: 'https://drive.google.com/file/d/1A2B3C4D5E6F7G8H9I0J/view?usp=sharing',"
);

code = code.replace(
  "status: 'Terbit',\n    driveUrl: 'https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J1K/view?usp=sharing',",
  "status: 'Sudah Membuat',\n    driveUrl: 'https://drive.google.com/file/d/2B3C4D5E6F7G8H9I0J1K/view?usp=sharing',"
);

code = code.replace(
  "status: 'Review',\n    driveUrl: 'https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1K2L/view?usp=sharing',",
  "status: 'Belum Membuat',\n    driveUrl: 'https://drive.google.com/file/d/3C4D5E6F7G8H9I0J1K2L/view?usp=sharing',"
);

code = code.replace(
  "status: 'Terbit',\n    driveUrl: 'https://drive.google.com/file/d/4D5E6F7G8H9I0J1K2L3M/view?usp=sharing',",
  "status: 'Sudah Membuat',\n    driveUrl: 'https://drive.google.com/file/d/4D5E6F7G8H9I0J1K2L3M/view?usp=sharing',"
);

code = code.replace(
  "item.status === 'Terbit'",
  "item.status === 'Sudah Membuat'"
);
code = code.replace(
  "item.status === 'Terbit'",
  "item.status === 'Sudah Membuat'"
);
code = code.replace(
  "item.status === 'Terbit' ? 'Disetujui Kamad' : 'Review Kamad'",
  "item.status === 'Sudah Membuat' ? 'Sudah Membuat' : 'Belum Membuat'"
);

fs.writeFileSync('src/pages/GuruPages.tsx', code);
