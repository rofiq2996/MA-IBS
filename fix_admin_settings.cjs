const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// The function is handleUpdateGuruSubjects
content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*\}\s*catch\(e\) \{\}\s*\}\s*\}/g, '}');

// The `adminSubjects` and `adminClasses` useMemo
content = content.replace(/const adminSubjects = React\.useMemo\(\(\) => \{\s*if \(typeof window !== 'undefined'\) \{\s*catch \(e\) \{\}\s*\}\s*\}\s*return \[\];\s*\}, \[\]\);/g, 'const adminSubjects = [];');
content = content.replace(/const adminClasses = React\.useMemo\(\(\) => \{\s*if \(typeof window !== 'undefined'\) \{\s*catch \(e\) \{\}\s*\}\s*\}\s*return \[\];\s*\}, \[\]\);/g, 'const adminClasses = [];');

fs.writeFileSync('src/pages/AdminSettings.tsx', content);
