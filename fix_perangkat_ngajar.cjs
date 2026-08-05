const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const \[teachingAssignments, setTeachingAssignments\] = useState<any\[\]>\(\[\]\);/;
content = content.replace(regex, `const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);`);

fs.writeFileSync(file, content);
console.log('Fixed Perangkat Ngajar');
