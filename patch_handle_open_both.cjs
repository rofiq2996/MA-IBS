const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const subjs = teacherAssignments\.filter\(a => a\.class_name === cls\)\.map\(a => a\.subject_name\);/;
const replacement = `const subjs = [
        ...teacherAssignments.filter(a => a.class_name === cls).map(a => a.subject_name),
        ...teacherSchedules.filter(s => s.class_name === cls).map(s => s.subject_name)
      ];`;

content = content.replace(regex, replacement);
fs.writeFileSync(file, content);
console.log('Replaced handleOpenAddModal');
