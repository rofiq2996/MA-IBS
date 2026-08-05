const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\s*fetchModul\(\);\s*apiClient\('\/crud\.php\?table=teaching_assignments'\)\.then\(res => \{\s*const assignments = Array\.isArray\(res\) \? res\.filter\(\(a: any\) => String\(a\.teacher_id\) === String\(user\?\.id\)\) : \[\];\s*setTeachingAssignments\(assignments\);\s*\}\)\.catch\(console\.error\);\s*\}, \[user\]\);/;

const replacement = `useEffect(() => {
    fetchModul();
    apiClient('/crud.php?table=teaching_assignments').then(res => {
      setTeachingAssignments(Array.isArray(res) ? res : []);
    }).catch(console.error);
  }, []);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced useEffect in PerangkatNgajar');
} else {
    console.log('Regex did not match');
}
