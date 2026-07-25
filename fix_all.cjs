const fs = require('fs');
const files = [
  'src/pages/AdminAcademic.tsx',
  'src/pages/AdminReports.tsx',
  'src/pages/AdminSettings.tsx',
  'src/pages/AdminStudents.tsx',
  'src/pages/AdminTeachingAssignments.tsx',
  'src/pages/AdminUsers.tsx',
  'src/pages/InputJadwal.tsx',
  'src/pages/AdminRombel.tsx',
  'src/pages/CBT.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const \[classes, setClasses\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState(mockClasses);');
  content = content.replace(/const \[users, setUsers\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockUsers;\s*\}\);/g, 'const [users, setUsers] = useState(mockUsers);');
  content = content.replace(/const \[students, setStudents\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockStudents;\s*\}\);/g, 'const [students, setStudents] = useState(mockStudents);');

  // Also replace versions without set*
  content = content.replace(/const \[classes\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockClasses;\s*\}\);/g, 'const [classes] = useState(mockClasses);');
  content = content.replace(/const \[users\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockUsers;\s*\}\);/g, 'const [users] = useState(mockUsers);');
  content = content.replace(/const \[students\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockStudents;\s*\}\);/g, 'const [students] = useState(mockStudents);');

  fs.writeFileSync(file, content);
}
