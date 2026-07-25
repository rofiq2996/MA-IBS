const fs = require('fs');

const files = [
  'src/pages/AdminKenaikanKelas.tsx',
  'src/pages/AdminTermSettings.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const \[classes, setClasses\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState(mockClasses);');
  content = content.replace(/const \[students, setStudents\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockStudents;\s*\}\);/g, 'const [students, setStudents] = useState(mockStudents);');

  content = content.replace(/const \[classes\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockClasses;\s*\}\);/g, 'const [classes] = useState(mockClasses);');
  content = content.replace(/const \[students\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockStudents;\s*\}\);/g, 'const [students] = useState(mockStudents);');

  fs.writeFileSync(file, content);
}
