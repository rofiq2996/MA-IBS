const fs = require('fs');
const files = [
  'src/pages/AdminSettings.tsx',
  'src/pages/InputJadwal.tsx',
  'src/pages/GuruPages.tsx',
  'src/pages/AdminUsers.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Add mockSubjects to import if mockUsers exists
  if (!content.includes('mockSubjects')) {
    content = content.replace(/mockUsers([^}]*)\} from '\.\.\/data\/mock';/, 'mockUsers$1, mockSubjects } from \'../data/mock\';');
  }

  // Replace subject useState with mockSubjects
  content = content.replace(/const \[subjects\] = useState<any\[\]>\(\[\]\);/g, 'const [subjects] = useState(mockSubjects);');
  content = content.replace(/const adminSubjects = \[\];/g, 'const adminSubjects = mockSubjects;');
  content = content.replace(/const adminClasses = \[\];/g, 'const adminClasses = mockClasses;');
  
  fs.writeFileSync(file, content);
}
