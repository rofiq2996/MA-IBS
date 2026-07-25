const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminUsers.tsx', 'utf8');

content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*if \(storedS\) \{\s*try \{\s*const s = JSON\.parse\(storedS\);\s*sOpts = s\.map\(\(subj: any\) => \(\{ value: subj\.name, label: subj\.name \}\)\);\s*\} catch\(e\) \{\}\s*\}\s*\}/g, '');
content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*if \(storedC\) \{\s*try \{\s*const c = JSON\.parse\(storedC\);\s*cOpts = c\.map\(\(cls: any\) => \(\{ value: cls\.name, label: cls\.name \}\)\);\s*\} catch\(e\) \{\}\s*\}\s*\}/g, '');

fs.writeFileSync('src/pages/AdminUsers.tsx', content);
