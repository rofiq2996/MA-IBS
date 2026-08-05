const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /\/\/ Extract unique classes\s*const uniqueClasses = Array\.from\(new Set\(teachingAssignments\.map\(a => a\.class_name\)\)\)\.sort\(\);\s*\/\/ Available subjects for selected class\s*const availableSubjects = teachingAssignments\s*\.filter\(a => a\.class_name === formClass\)\s*\.map\(a => a\.subject_name\);/;

const replacement = `// Get assignments for current user
  const teacherAssignments = teachingAssignments.filter((a: any) => String(a.teacher_id) === String(user?.id));

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(teacherAssignments.map(a => a.class_name))).sort();
  
  // Available subjects for selected class
  const availableSubjects = teacherAssignments
    .filter(a => a.class_name === formClass)
    .map(a => a.subject_name);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced class logic');
} else {
    console.log('Regex did not match');
}
