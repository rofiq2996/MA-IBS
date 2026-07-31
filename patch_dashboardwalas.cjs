const fs = require('fs');
const file = 'src/pages/DashboardWalas.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`import { mockStudents } from '../data/mock';`,
`import { mockStudents } from '../data/mock';
import { apiClient } from '../lib/apiClient';
import { useEffect } from 'react';`
);

code = code.replace(
`  const { user } = useAuth();
  const navigate = useNavigate();`,
`  const { user } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    const myClass = user.className || user.class_name;
    apiClient('/crud.php?table=students').then(data => {
      setStudents(data.filter((s:any) => s.class_name === myClass));
    }).catch(console.error);
  }, [user]);`
);

code = code.replace(
`{mockStudents.filter(s => s.className === user?.className).slice(0, 5).map((student, idx) => (`,
`{students.slice(0, 5).map((student, idx) => (`
);

fs.writeFileSync(file, code);
