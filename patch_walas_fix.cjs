const fs = require('fs');
const file = 'src/pages/WalasPages.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  const [studentId, setStudentId] = useState(mockStudents[0]?.id || '');`,
`  const [studentId, setStudentId] = useState('');
  useEffect(() => {
    if (students.length > 0 && !studentId) {
      setStudentId(students[0].id);
    }
  }, [students]);`
);
fs.writeFileSync(file, code);
