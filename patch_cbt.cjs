const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/CBT.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ mockStudents, mockClasses \} from '\.\.\/data\/mock';/, `import { apiClient } from '../lib/apiClient';`);

content = content.replace(/const \[classes\] = useState\(mockClasses\);/, `const [classes, setClasses] = useState<any[]>([]);`);
content = content.replace(/const studentData = isSiswa \? mockStudents\.find\(s => s\.nis === user\?\.username\) : null;/, `const [studentData, setStudentData] = useState<any>(null);
  
  useEffect(() => {
    Promise.all([
      apiClient('/crud.php?table=classes').then(res => setClasses(res || [])).catch(() => {}),
      isSiswa ? apiClient('/crud.php?table=students').then(res => {
        const student = (res || []).find((s: any) => s.nis === user?.username);
        if (student) setStudentData(student);
      }).catch(() => {}) : Promise.resolve()
    ]);
  }, [isSiswa, user]);
`);

fs.writeFileSync(file, content);
console.log('Patched CBT.tsx');
