const fs = require('fs');
const glob = require('fs').readdirSync('src/pages');

for (const f of glob) {
  if (!f.endsWith('.tsx')) continue;
  const file = 'src/pages/' + f;
  let content = fs.readFileSync(file, 'utf8');

  content = content.replace(/const \[([a-zA-Z]+)\] = useState(?:<[^>]+>)?\(\(\) => \{\s*if \(typeof window !== 'undefined'\) \{\s*const stored = localStorage\.getItem\('mock[a-zA-Z]+'\);\s*if \(stored\) \{\s*try \{ return JSON\.parse\(stored\); \} catch \(e\) \{\}\s*\}\s*\}\s*return mock([a-zA-Z]+);\s*\}\);/g, (match, p1, p2) => {
    return `const [${p1}] = useState(mock${p2});`;
  });

  content = content.replace(/const \[([a-zA-Z]+), ([a-zA-Z]+)\] = useState(?:<[^>]+>)?\(\(\) => \{\s*if \(typeof window !== 'undefined'\) \{\s*const stored = localStorage\.getItem\('mock[a-zA-Z]+'\);\s*if \(stored\) \{\s*try \{ return JSON\.parse\(stored\); \} catch \(e\) \{\}\s*\}\s*\}\s*return mock([a-zA-Z]+);\s*\}\);/g, (match, p1, p2, p3) => {
    return `const [${p1}, ${p2}] = useState(mock${p3});`;
  });

  // Specifically for `const storedStudents = localStorage.getItem('mockStudents');`
  content = content.replace(/const storedStudents = localStorage\.getItem\('mockStudents'\);\s*if \(storedStudents\) \{\s*try \{ \n?\s*const parsed = JSON\.parse\(storedStudents\);[^}]*\}\s*catch \(e\) \{\}\s*\}/g, '');

  fs.writeFileSync(file, content);
}
