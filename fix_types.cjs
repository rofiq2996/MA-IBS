const fs = require('fs');

const fixTypes = (filename) => {
  let file = fs.readFileSync(filename, 'utf8');
  file = file.replace(/Object\.entries\(attendance\)\.map\(async \(\[studentId, data\]\) => \{/g, 'Object.entries(attendance).map(async ([studentId, data]: [string, any]) => {');
  fs.writeFileSync(filename, file);
};

fixTypes('src/pages/GuruPages.tsx');
fixTypes('src/pages/GuruQuranPages.tsx');
fixTypes('src/pages/WalasPages.tsx');

