const fs = require('fs');
const path = './src/pages/DashboardAdmin.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Users, GraduationCap, BookOpen, Clock, Activity, Calendar, Bell, ChevronRight, UserCheck } from 'lucide-react';",
  "import { Users, GraduationCap, BookOpen, Clock, Activity, Calendar, Bell, ChevronRight, UserCheck } from 'lucide-react';\nimport { apiClient } from '../lib/apiClient';"
);

content = content.replace(
  "const [students] = useState(mockStudents);",
  "const [students, setStudents] = useState<any[]>([]);"
);
content = content.replace(
  "const [classes] = useState(mockClasses);",
  "const [classes, setClasses] = useState<any[]>([]);"
);
content = content.replace(
  "const [users] = useState(mockUsers);",
  "const [users, setUsers] = useState<any[]>([]);"
);

const fetchCode = `  const fetchData = async () => {
    try {
      const [studentsData, classesData, usersData] = await Promise.all([
        apiClient('/crud.php?table=students'),
        apiClient('/crud.php?table=classes'),
        apiClient('/crud.php?table=users')
      ]);
      setStudents(studentsData);
      setClasses(classesData);
      setUsers(usersData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`;

content = content.replace(
  /export function DashboardAdmin\(\) \{/,
  `export function DashboardAdmin() {\n${fetchCode}`
);

fs.writeFileSync(path, content, 'utf8');
console.log('DashboardAdmin done');
