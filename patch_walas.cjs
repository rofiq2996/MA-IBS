const fs = require('fs');
const file = 'src/pages/WalasPages.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`import { mockStudents } from '../data/mock';`,
`import { mockStudents } from '../data/mock';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../lib/apiClient';`
);

// We need to inject the fetch for students in each component.
// Or we can create a shared hook at the top.
const hookCode = `
function useWalasStudents() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  useEffect(() => {
    if (!user) return;
    apiClient('/crud.php?table=students').then(data => {
       // Find students belonging to this walas
       const myClass = user.className || user.class_name;
       const filtered = data.filter((s:any) => s.class_name === myClass);
       setStudents(filtered.map((s:any) => ({ id: String(s.id), name: s.name, nis: s.nis, className: s.class_name })));
    }).catch(console.error);
  }, [user]);
  return students;
}
`;

code = code.replace(
`export function PemantauanPagi() {`,
hookCode + `\nexport function PemantauanPagi() {`
);

fs.writeFileSync(file, code);
