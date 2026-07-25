const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminReports.tsx', 'utf8');

content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*if \(storedStudents\) currentStudents = JSON\.parse\(storedStudents\);\s*if \(storedUsers\) currentUsers = JSON\.parse\(storedUsers\);\s*\}/g, '');

fs.writeFileSync('src/pages/AdminReports.tsx', content);
