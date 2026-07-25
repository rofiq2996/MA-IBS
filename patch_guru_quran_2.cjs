const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruQuranPages.tsx', 'utf8');

code = code.replace(
  "...availableClasses.map(c => ({ value: c, label: c }))",
  "...availableClasses.filter(Boolean).map(c => ({ value: String(c), label: String(c) }))"
);

fs.writeFileSync('src/pages/GuruQuranPages.tsx', code);
