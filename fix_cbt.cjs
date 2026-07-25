const fs = require('fs');
let content = fs.readFileSync('src/pages/CBT.tsx', 'utf8');

content = content.replace(/const \[classes\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : mockClasses;\s*\}\);/g, 'const [classes] = useState(mockClasses);');

fs.writeFileSync('src/pages/CBT.tsx', content);
