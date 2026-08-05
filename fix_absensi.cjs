const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const \[teachingAssignments, setTeachingAssignments\] = useState<any\[\]>\(\[\]\);\s*const \[schedules, setSchedules\] = useState<any\[\]>\(\[\]\);/;
content = content.replace(regex, `const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);`);

fs.writeFileSync(file, content);
console.log('Fixed Absensi');
