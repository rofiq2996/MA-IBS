const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /useEffect\(\(\) => \{\s*fetchModul\(\);\s*\}, \[\]\);/;
const replacement = `useEffect(() => {
    fetchModul();
    apiClient('/crud.php?table=teaching_assignments').then(res => {
      const assignments = Array.isArray(res) ? res.filter((a: any) => String(a.teacher_id) === String(user?.id)) : [];
      setTeachingAssignments(assignments);
    }).catch(console.error);
  }, [user]);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced useEffect');
} else {
    console.log('Regex did not match');
}
