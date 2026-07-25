const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminTeachingAssignments.tsx', 'utf8');

content = content.replace(/const \[classes, setClasses\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState(mockClasses);');
content = content.replace(/return saved \? JSON\.parse\(saved\) :/g, 'return');

fs.writeFileSync('src/pages/AdminTeachingAssignments.tsx', content);
