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
  
  // Replace long useState blocks for users, students, classes, subjects
  content = content.replace(/useState<User\[\]>\(\(\) => \{[\s\S]*?return mockUsers;\s*\}\)/g, 'useState<User[]>(mockUsers)');
  content = content.replace(/useState\(\(\) => \{[\s\S]*?return mockStudents;\s*\}\)/g, 'useState(mockStudents)');
  content = content.replace(/useState\(\(\) => \{[\s\S]*?return mockClasses;\s*\}\)/g, 'useState(mockClasses)');
  content = content.replace(/useState\(\(\) => \{[\s\S]*?return mockSubjects;\s*\}\)/g, 'useState(mockSubjects)');
  content = content.replace(/useState<Student\[\]>\(\(\) => \{[\s\S]*?return mockStudents;\s*\}\)/g, 'useState<Student[]>(mockStudents)');

  content = content.replace(/localStorage\.setItem\('mock[^']+',[^)]+\);/g, '');
  content = content.replace(/const stored[A-Za-z0-9_]* = localStorage\.getItem\('mock[^']+'\);/g, '');
  content = content.replace(/const saved[A-Za-z0-9_]* = localStorage\.getItem\('mock[^']+'\);/g, '');
  content = content.replace(/if\s*\(stored\)\s*\{[\s\S]*?\}/g, '');
  
  fs.writeFileSync(file, content);
}
