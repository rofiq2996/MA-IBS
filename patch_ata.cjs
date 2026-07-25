const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminTeachingAssignments.tsx', 'utf8');

content = content.replace(/const \[subjects, setSubjects\] = useState<any\[\]>\(\(\) => \{\s*return \[\s*\{ id: '1', name: 'Matematika' \},\s*\{ id: '2', name: 'Bahasa Indonesia' \},\s*\{ id: '3', name: 'Pendidikan Agama Islam' \},\s*\];\s*\}\);/g, 'const [subjects] = useState(mockSubjects);');

fs.writeFileSync('src/pages/AdminTeachingAssignments.tsx', content);
