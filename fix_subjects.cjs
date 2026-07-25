const fs = require('fs');
const files = [
  'src/pages/AdminSettings.tsx',
  'src/pages/InputJadwal.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const \[subjects, setSubjects\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockSubjects;\s*\}\);/g, 'const [subjects, setSubjects] = useState(mockSubjects);');
  content = content.replace(/const \[subjects\] = useState(?:<[^>]+>)?\(\(\) => \{[^}]*if \(typeof window !== 'undefined'\) \{[^}]*catch \(e\) \{\}\s*\}\s*\}\s*return mockSubjects;\s*\}\);/g, 'const [subjects] = useState(mockSubjects);');

  fs.writeFileSync(file, content);
}
