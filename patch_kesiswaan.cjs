const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src/pages/KesiswaanPages.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import \{ mockStudents as globalStudents \} from '\.\.\/data\/mock';/, `import { apiClient } from '../lib/apiClient';`);

content = content.replace(/const mockStudents = globalStudents\.map\(s => \(\{[\s\S]*?\}\)\);/, `const [mockStudents, setStudents] = useState<any[]>([]);
  useEffect(() => {
    apiClient('/crud.php?table=students').then(res => {
      setStudents((res || []).map((s: any) => ({
        id: String(s.id),
        name: s.name,
        kelas: s.class_name || s.kelas || '-'
      })));
    }).catch(console.error);
  }, []);`);

fs.writeFileSync(file, content);
console.log('Patched KesiswaanPages.tsx');
