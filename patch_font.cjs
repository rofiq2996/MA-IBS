const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');
code = code.replace(
  'style={{ fontFamily: \'"Amiri", "Noto Naskh Arabic", "Traditional Arabic", serif\', lineHeight: \'2\' }}',
  'style={{ fontFamily: \'"KFGQPC Uthman Taha Naskh", "Amiri Quran", "Amiri", "Traditional Arabic", serif\', lineHeight: \'2.5\' }}'
);
fs.writeFileSync('src/pages/Login.tsx', code);
console.log("Patched successfully");
