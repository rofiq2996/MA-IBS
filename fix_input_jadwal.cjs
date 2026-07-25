const fs = require('fs');
let content = fs.readFileSync('src/pages/InputJadwal.tsx', 'utf8');

if (content.includes('const [subjects] = useState(mockSubjects);')) {
  content = content.replace(
    'const [subjects] = useState(mockSubjects);',
    `const [subjects, setSubjects] = useState<any[]>([]);\n  useEffect(() => {\n    dbClient.get('subjects').then(data => {\n      if (Array.isArray(data)) setSubjects(data);\n    });\n  }, []);`
  );
  content = content.replace(`import { mockClasses, mockUsers , mockSubjects } from '../data/mock';`, `import { mockClasses, mockUsers } from '../data/mock';\nimport { dbClient } from '../lib/dbClient';`);
  fs.writeFileSync('src/pages/InputJadwal.tsx', content);
}
