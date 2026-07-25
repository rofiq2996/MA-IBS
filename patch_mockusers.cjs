const fs = require('fs');
const files = [
  'src/pages/AdminAcademic.tsx',
  'src/pages/AdminReports.tsx',
  'src/pages/AdminSettings.tsx',
  'src/pages/AdminStudents.tsx',
  'src/pages/AdminTeachingAssignments.tsx',
  'src/pages/AdminUsers.tsx',
  'src/pages/InputJadwal.tsx',
  'src/pages/AdminRombel.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const \[users, setUsers\] = useState<User\[\]>\(\(\) => \{[^}]*return mockUsers;\s*\}\);/g, 'const [users, setUsers] = useState<User[]>(mockUsers);');
  content = content.replace(/localStorage\.setItem\('mockUsers', JSON\.stringify\([^)]+\)\);/g, '');
  content = content.replace(/const stored = localStorage\.getItem\('mockUsers'\);/g, '');
  // specific logic for adminreports
  content = content.replace(/const storedUsers = localStorage\.getItem\('mockUsers'\);/g, '');
  content = content.replace(/if\s*\(storedUsers\)\s*\{\s*try\s*\{\s*currentUsers = JSON\.parse\(storedUsers\);\s*\}\s*catch\s*\(e\)\s*\{\}\s*\}/g, '');
  // specific logic for teaching assignments
  content = content.replace(/const saved = localStorage\.getItem\('mockUsers'\);\n\s*return saved \? JSON\.parse\(saved\) : mockUsers;/g, 'return mockUsers;');
  
  fs.writeFileSync(file, content);
}
