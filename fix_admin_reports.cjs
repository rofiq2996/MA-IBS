const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

content = content.replace(/const \[classes\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : mockClasses;\s*\}\);/g, 'const [classes] = useState(mockClasses);');

// also it complained about `storedStudents`
content = content.replace(/let currentStudents = mockStudents;\s*return currentStudents;\s*\(\);/g, 'let currentStudents = mockStudents; return currentStudents;');
content = content.replace(/let currentUsers = mockUsers;\s*return currentUsers;/g, 'let currentUsers = mockUsers; return currentUsers;');

fs.writeFileSync('src/pages/AdminReports.tsx', content);
