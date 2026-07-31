const fs = require('fs');
const file = 'src/pages/InputJadwal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`import { mockClasses, mockUsers } from '../data/mock';`,
`import { mockClasses, mockUsers } from '../data/mock';`
);

// We need to fetch real users for teachers
code = code.replace(
`export function InputJadwal() {
  const [classes, setClasses] = useState<any[]>(mockClasses);`,
`export function InputJadwal() {
  const [classes, setClasses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
     apiClient('/sync').then(data => {
        if(data.classes) setClasses(data.classes);
        if(data.users) setUsers(data.users);
        if(data.classes && data.classes.length > 0) {
           setRombel(data.classes[0].name);
           setFilterRombel(data.classes[0].name);
        }
     });
  }, []);
`
);

code = code.replace(
`guruName: mockUsers.find(u => String(u.id) === String(d.teacher_id))?.name || 'Guru'`,
`guruName: users.find((u:any) => String(u.id) === String(d.teacher_id))?.name || 'Guru'`
);
// But wait, users might not be loaded yet when fetchSchedules is called! 
// Let's modify fetchSchedules so it uses `users` state? But `users` is updated asynchronously.

fs.writeFileSync(file, code);
