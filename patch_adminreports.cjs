const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/AdminReports.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ mockClasses, mockStudents, mockUsers \} from '\.\.\/data\/mock';/, `import { apiClient } from '../lib/apiClient';`);

content = content.replace(/const \[classes\] = useState\(mockClasses\);/, `const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    Promise.all([
      apiClient('/crud.php?table=classes'),
      apiClient('/crud.php?table=students'),
      apiClient('/crud.php?table=users')
    ]).then(([cRes, sRes, uRes]) => {
      setClasses(cRes || []);
      setStudents(sRes || []);
      setUsers(uRes || []);
    }).catch(console.error);
  }, []);`);

content = content.replace(/let currentStudents = mockStudents;/, 'let currentStudents = students;');
content = content.replace(/let currentUsers = mockUsers;/, 'let currentUsers = users;');

content = content.replace(/mockStudents/g, 'students');
content = content.replace(/mockUsers/g, 'users');

fs.writeFileSync(file, content);
console.log('Patched AdminReports.tsx');
