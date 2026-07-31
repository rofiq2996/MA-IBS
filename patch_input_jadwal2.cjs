const fs = require('fs');
const file = 'src/pages/InputJadwal.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  useEffect(() => {
    fetchSchedules();
  }, []);`,
`  useEffect(() => {
    if(users.length > 0) {
      fetchSchedules();
    }
  }, [users]);`
);

code = code.replace(
`  const teachers = mockUsers.filter(u => u.role === 'guru' || u.role === 'walas' || u.role === 'guru_quran');`,
`  const teachers = users.filter((u:any) => u.role === 'guru' || u.role === 'walas' || u.role === 'guru_quran');`
);

fs.writeFileSync(file, code);
