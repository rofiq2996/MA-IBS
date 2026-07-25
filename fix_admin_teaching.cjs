const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminTeachingAssignments.tsx', 'utf8');

content = content.replace(/const \[classes, setClasses\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState(mockClasses);');
content = content.replace(/const \[subjects, setSubjects\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : \[\s*\{ id: '1', name: 'Matematika' \},\s*\{ id: '2', name: 'Bahasa Indonesia' \},\s*\{ id: '3', name: 'Pendidikan Agama Islam' \},\s*\{ id: '4', name: 'Bahasa Inggris' \}\s*\];\s*\}\);/g, "const [subjects, setSubjects] = useState([{ id: '1', name: 'Matematika' }, { id: '2', name: 'Bahasa Indonesia' }, { id: '3', name: 'Pendidikan Agama Islam' }, { id: '4', name: 'Bahasa Inggris' }]);");
// Also need to handle just the `saved` usage
content = content.replace(/return saved \? JSON\.parse\(saved\) : \[\s*\{ id: '1', name: 'Matematika' \},\s*\{ id: '2', name: 'Bahasa Indonesia' \},\s*\{ id: '3', name: 'Pendidikan Agama Islam' \},\s*\{ id: '4', name: 'Bahasa Inggris' \},\s*\{ id: '5', name: 'IPA' \},\s*\{ id: '6', name: 'IPS' \}\s*\];\s*\}\);/g, "return [{ id: '1', name: 'Matematika' }, { id: '2', name: 'Bahasa Indonesia' }, { id: '3', name: 'Pendidikan Agama Islam' }, { id: '4', name: 'Bahasa Inggris' }, { id: '5', name: 'IPA' }, { id: '6', name: 'IPS' }];});");

fs.writeFileSync('src/pages/AdminTeachingAssignments.tsx', content);
