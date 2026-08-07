const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /const classSchedules = teacherSchedules\.filter\(s => s\.class_name === selectedClass\);\s*const classSubjectsList = classSchedules\.length > 0\s*\?\s*Array\.from\(new Set\(classSchedules\.map\(s => s\.subject_name\)\)\)\.filter\(Boolean\) as string\[\]\s*:\s*Array\.from\(new Set\(subjects\.filter\(\(s: any\) => s\.className === selectedClass\)\.map\(\(s: any\) => s\.subjectName\)\)\)\.filter\(Boolean\) as string\[\];/g;

const newLogic = `const classSchedules = teacherSchedules.filter(s => s.class_name === selectedClass);
  const classAssignments = teacherAssignments.filter((a: any) => a.class_name === selectedClass);
  const classSubjectsList = Array.from(new Set([
    ...classSchedules.map(s => s.subject_name),
    ...classAssignments.map(a => a.subject_name),
    ...subjects.filter((s: any) => s.className === selectedClass).map((s: any) => s.subjectName)
  ])).filter(Boolean) as string[];`;

file = file.replace(regex, newLogic);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
