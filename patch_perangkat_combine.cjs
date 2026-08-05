const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regexStates = /const \[teachingAssignments, setTeachingAssignments\] = useState<any\[\]>\(\[\]\);/;
const replacementStates = `const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);`;

const regexEffect = /apiClient\('\/crud\.php\?table=teaching_assignments'\)\.then\(res => \{\s*setTeachingAssignments\(Array\.isArray\(res\) \? res : \[\]\);\s*\}\)\.catch\(console\.error\);/g;
const replacementEffect = `apiClient('/crud.php?table=teaching_assignments').then(res => {
      setTeachingAssignments(Array.isArray(res) ? res : []);
    }).catch(console.error);
    apiClient('/crud.php?table=schedules').then(res => {
      setSchedules(Array.isArray(res) ? res : []);
    }).catch(console.error);`;

const regexClasses = /\/\/ Get assignments for current user\s*const teacherAssignments = teachingAssignments\.filter\(\(a: any\) => String\(a\.teacher_id\) === String\(user\?\.id\)\);\s*\/\/ Extract unique classes\s*const uniqueClasses = Array\.from\(new Set\(teacherAssignments\.map\(a => a\.class_name\)\)\)\.sort\(\);\s*\/\/ Available subjects for selected class\s*const availableSubjects = teacherAssignments\s*\.filter\(a => a\.class_name === formClass\)\s*\.map\(a => a\.subject_name\);/;
const replacementClasses = `// Get assignments and schedules for current user
  const teacherAssignments = teachingAssignments.filter((a: any) => String(a.teacher_id) === String(user?.id));
  const teacherSchedules = schedules.filter((s: any) => String(s.teacher_id) === String(user?.id));

  // Extract unique classes from both
  const allClasses = [...teacherAssignments.map(a => a.class_name), ...teacherSchedules.map(s => s.class_name)];
  const uniqueClasses = Array.from(new Set(allClasses)).filter(Boolean).sort();
  
  // Available subjects for selected class from both
  const allSubjectsForClass = [
    ...teacherAssignments.filter(a => a.class_name === formClass).map(a => a.subject_name),
    ...teacherSchedules.filter(s => s.class_name === formClass).map(s => s.subject_name)
  ];
  const availableSubjects = Array.from(new Set(allSubjectsForClass)).filter(Boolean).sort();`;

content = content.replace(regexStates, replacementStates);
content = content.replace(regexEffect, replacementEffect);
content = content.replace(regexClasses, replacementClasses);

fs.writeFileSync(file, content);
console.log('Replaced states, effect and classes');
