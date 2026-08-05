const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const handleOpenAddModal = \(\) => \{\s*setEditingId\(null\);\s*setFormSubject\(teacherSubjects\[0\]\?\.subjectName \|\| 'Matematika'\);\s*setFormClass\(teacherSubjects\[0\]\?\.className \|\| 'X IPA 1'\);/;
const replacement = `const handleOpenAddModal = () => {
    setEditingId(null);
    if (uniqueClasses.length > 0) {
      const cls = uniqueClasses[0] as string;
      setFormClass(cls);
      const subjs = teachingAssignments.filter(a => a.class_name === cls).map(a => a.subject_name);
      if (subjs.length > 0) setFormSubject(subjs[0] as string);
    }`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced handleOpenAddModal');
} else {
    console.log('Regex did not match');
}
