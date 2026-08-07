const fs = require('fs');

function addMax(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/type="date"/g, "type=\"date\"\n                max={new Date().toISOString().split('T')[0]}");
  fs.writeFileSync(file, content);
}

addMax('src/pages/GuruPages.tsx');
addMax('src/pages/WalasPages.tsx');
addMax('src/pages/GuruQuranPages.tsx');
