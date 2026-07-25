const fs = require('fs');
let content = fs.readFileSync('src/pages/InputJadwal.tsx', 'utf8');

content = content.replace(/const \[classes, setClasses\] = useState<any\[\]>\(\(\) => \{\s*return saved \? JSON\.parse\(saved\) : mockClasses;\s*\}\);/g, 'const [classes, setClasses] = useState<any[]>(mockClasses);');
content = content.replace(/const \[subjects\] = useState<any\[\]>\(\(\) => \{\s*catch \(e\) \{\}\s*\}\s*return \[\];\s*\}\);/g, 'const [subjects] = useState<any[]>([]);');

fs.writeFileSync('src/pages/InputJadwal.tsx', content);
