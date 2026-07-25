const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminStudents.tsx', 'utf8');

code = code.replace(
  "Grade {s.grade || (s.className ? s.className.split(' ')[0] : 'X')} &bull; {s.className || 'Belum Ada Rombel'}",
  "{s.className ? `Grade ${s.grade || (s.className.split(' ')[0])} \\u2022 ${s.className}` : `Grade ${s.grade || 'X'}`}"
);

fs.writeFileSync('src/pages/AdminStudents.tsx', code);
