const fs = require('fs');
let code = fs.readFileSync('src/pages/GuruQuranPages.tsx', 'utf8');

code = code.replace(
  "export function DashboardGuruQuran() {\n  const { user } = useAuth();\n  \n  const mockStudentsData = globalStudents.map(s => ({\n    id: s.id,\n    name: s.name,\n    className: s.className || s.grade\n  }));",
  "const mockStudentsData = globalStudents.map(s => ({\n  id: s.id,\n  name: s.name,\n  className: s.className || s.grade\n}));\n\nexport function DashboardGuruQuran() {\n  const { user } = useAuth();"
);

fs.writeFileSync('src/pages/GuruQuranPages.tsx', code);
