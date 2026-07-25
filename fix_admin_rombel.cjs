const fs = require('fs');
const path = './src/pages/AdminRombel.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Users, UserPlus, UserMinus, Search } from 'lucide-react';",
  "import { Users, UserPlus, UserMinus, Search } from 'lucide-react';\nimport { apiClient } from '../lib/apiClient';"
);

content = content.replace(
  "const [students, setStudents] = useState<Student[]>(mockStudents);",
  "const [students, setStudents] = useState<Student[]>([]);"
);

content = content.replace(
  "const [classes] = useState(mockClasses);",
  "const [classes, setClasses] = useState<{name:string}[]>([]);"
);


// Replace initial render loading and logic
const fetchCode = `  const fetchData = async () => {
    try {
       const [studentsData, classesData] = await Promise.all([
          apiClient('/crud.php?table=students'),
          apiClient('/crud.php?table=classes')
       ]);
       setStudents(studentsData.map((s:any) => ({
          id: String(s.id),
          name: s.name,
          nis: s.nis,
          className: s.class_name,
          gender: s.gender,
          grade: s.class_name ? s.class_name.split(' ')[0] : 'X'
       })));
       setClasses(classesData.map((c:any) => ({ name: c.name })));
    } catch (e) {
       console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`;

content = content.replace(
  /useEffect\(\(\) => \{\n    \n  \}, \[students\]\);/,
  fetchCode
);

// handleAddToClass
content = content.replace(
  /const handleAddToClass = \(studentId: string\) => \{[\s\S]*?setStudents\(updated\);\n  \};/,
  `const handleAddToClass = async (studentId: string) => {
    if (!selectedClass) return;
    try {
      await apiClient(\`/crud.php?table=students&id=\${studentId}\`, {
         method: 'PUT',
         body: JSON.stringify({ class_name: selectedClass })
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };`
);

// handleRemoveFromClass
content = content.replace(
  /const handleRemoveFromClass = \(studentId: string\) => \{[\s\S]*?setStudents\(updated\);\n  \};/,
  `const handleRemoveFromClass = async (studentId: string) => {
    try {
      await apiClient(\`/crud.php?table=students&id=\${studentId}\`, {
         method: 'PUT',
         body: JSON.stringify({ class_name: '' }) // Remove from class
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };`
);

fs.writeFileSync(path, content, 'utf8');
console.log('AdminRombel done');
