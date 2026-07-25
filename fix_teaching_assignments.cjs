const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminTeachingAssignments.tsx', 'utf8');

// If mockSubjects is used, replace it with dbClient.get('subjects')
if (content.includes('const [subjects] = useState(mockSubjects);')) {
  content = content.replace(
    'const [subjects] = useState(mockSubjects);',
    `const [subjects, setSubjects] = useState<any[]>([]);\n  useEffect(() => {\n    dbClient.get('subjects').then(data => {\n      if (Array.isArray(data)) setSubjects(data);\n    });\n  }, []);`
  );
  fs.writeFileSync('src/pages/AdminTeachingAssignments.tsx', content);
}
