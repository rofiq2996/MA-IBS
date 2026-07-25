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

  // Let's just fix the specific syntax errors by replacing the whole useState with mock data
  content = content.replace(/const \[users, setUsers\] = useState<User\[\]>\(\(\) => \{[\s\S]*?return mockUsers;\s*\}\);/g, 'const [users, setUsers] = useState<User[]>(mockUsers);');
  content = content.replace(/const \[students\] = useState\(\(\) => \{[\s\S]*?return mockStudents;\s*\}\);/g, 'const [students] = useState(mockStudents);');
  content = content.replace(/const \[students, setStudents\] = useState\(\(\) => \{[\s\S]*?return mockStudents;\s*\}\);/g, 'const [students, setStudents] = useState(mockStudents);');
  content = content.replace(/const \[classes\] = useState\(\(\) => \{[\s\S]*?return mockClasses;\s*\}\);/g, 'const [classes] = useState(mockClasses);');
  content = content.replace(/const \[classes, setClasses\] = useState\(\(\) => \{[\s\S]*?return mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState(mockClasses);');
  content = content.replace(/const \[subjects, setSubjects\] = useState\(\(\) => \{[\s\S]*?return mockSubjects;\s*\}\);/g, 'const [subjects, setSubjects] = useState(mockSubjects);');
  content = content.replace(/const \[subjects\] = useState\(\(\) => \{[\s\S]*?return mockSubjects;\s*\}\);/g, 'const [subjects] = useState(mockSubjects);');
  content = content.replace(/const \[students, setStudents\] = useState<Student\[\]>\(\(\) => \{[\s\S]*?return mockStudents;\s*\}\);/g, 'const [students, setStudents] = useState<Student[]>(mockStudents);');
  
  // also fix localstorage setItems
  content = content.replace(/localStorage\.setItem\('mockUsers'[^;]+;/g, '');
  content = content.replace(/localStorage\.setItem\('mockStudents'[^;]+;/g, '');
  content = content.replace(/localStorage\.setItem\('mockClasses'[^;]+;/g, '');
  content = content.replace(/localStorage\.setItem\('mockSubjects'[^;]+;/g, '');

  fs.writeFileSync(file, content);
}
