const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/GuruPages.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /const \[formSubject, setFormSubject\] = useState\(teacherSubjects\[0\]\?\.subjectName \|\| 'Matematika'\);\s*const \[formClass, setFormClass\] = useState\(teacherSubjects\[0\]\?\.className \|\| 'X IPA 1'\);/;
const replacement = `const [formSubject, setFormSubject] = useState('');
  const [formClass, setFormClass] = useState('');

  // Extract unique classes
  const uniqueClasses = Array.from(new Set(teachingAssignments.map(a => a.class_name))).sort();
  
  // Available subjects for selected class
  const availableSubjects = teachingAssignments
    .filter(a => a.class_name === formClass)
    .map(a => a.subject_name);

  useEffect(() => {
    if (!editingId && uniqueClasses.length > 0 && !formClass) {
      setFormClass(uniqueClasses[0] as string);
    }
  }, [uniqueClasses, formClass, editingId]);

  useEffect(() => {
    if (!editingId && availableSubjects.length > 0) {
      if (availableSubjects.length === 1) {
        setFormSubject(availableSubjects[0] as string);
      } else if (!availableSubjects.includes(formSubject)) {
        setFormSubject(availableSubjects[0] as string);
      }
    }
  }, [formClass, availableSubjects, editingId, formSubject]);`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(file, content);
    console.log('Replaced form states and added effect');
} else {
    console.log('Regex did not match');
}
