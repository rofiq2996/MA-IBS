const fs = require('fs');
const path = './src/pages/AdminAcademic.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { Edit2, Trash2, Plus, Users, Search, X } from 'lucide-react';",
  "import { Edit2, Trash2, Plus, Users, Search, X } from 'lucide-react';\nimport { apiClient } from '../lib/apiClient';"
);

// replace state
content = content.replace(
  "const [classes, setClasses] = useState(mockClasses);",
  "const [classes, setClasses] = useState<any[]>([]);"
);
content = content.replace(
  "const [allStudents, setAllStudents] = useState<Student[]>(mockStudents);",
  "const [allStudents, setAllStudents] = useState<Student[]>([]);"
);
content = content.replace(
  "const [users, setUsers] = useState(mockUsers);",
  "const [users, setUsers] = useState<any[]>([]);"
);

// Add fetchData
const fetchCode = `  const fetchData = async () => {
    try {
      const [classesData, studentsData, usersData] = await Promise.all([
        apiClient('/crud.php?table=classes'),
        apiClient('/crud.php?table=students'),
        apiClient('/crud.php?table=users')
      ]);
      setClasses(classesData.map((c: any) => ({
         id: Number(c.id),
         name: c.name,
         wali_kelas_id: c.wali_kelas_id,
         students: studentsData.filter((s:any) => s.class_name === c.name).length
      })));
      setAllStudents(studentsData.map((s:any) => ({
         id: String(s.id),
         name: s.name,
         nis: s.nis,
         className: s.class_name,
      })));
      setUsers(usersData.map((u:any) => ({
         id: String(u.id),
         name: u.name,
         role: u.role,
         className: u.class_name
      })));
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`;

content = content.replace(
  /useEffect\(\(\) => \{\n    \n  \}, \[classes\]\);\n\n  useEffect\(\(\) => \{\n    \n  \}, \[users\]\);/,
  fetchCode
);


content = content.replace(
  /const handleDelete = \(id: number\) => \{[\s\S]*?setClasses\(classes\.filter\(c => c\.id !== id\)\);\n    \}\n    setDeleteConfirmId\(null\);\n  \};/,
  `const handleDelete = async (id: number) => {
    if (deleteConfirmId) {
      try {
        await apiClient(\`/crud.php?table=classes&id=\${id}\`, { method: 'DELETE' });
        fetchData();
      } catch (e) {
        console.error(e);
      }
    }
    setDeleteConfirmId(null);
  };`
);


// Fix Save
content = content.replace(
  /const handleSave = \(e: React\.FormEvent\) => \{[\s\S]*?setIsModalOpen\(false\);\n  \};/,
  `const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = \`\${tingkat} \${rombel}\`.trim();
    const payload = {
       name,
       wali_kelas_id: waliKelasId ? Number(waliKelasId) : null
    };

    try {
        if (editingId) {
            await apiClient(\`/crud.php?table=classes&id=\${editingId}\`, { method: 'PUT', body: JSON.stringify(payload) });
            // Update walas assignment logic
            if (waliKelasId) {
               await apiClient(\`/crud.php?table=users&id=\${waliKelasId}\`, { method: 'PUT', body: JSON.stringify({ role: 'walas', class_name: name }) });
            }
        } else {
            await apiClient('/crud.php?table=classes', { method: 'POST', body: JSON.stringify(payload) });
            if (waliKelasId) {
               await apiClient(\`/crud.php?table=users&id=\${waliKelasId}\`, { method: 'PUT', body: JSON.stringify({ role: 'walas', class_name: name }) });
            }
        }
        fetchData();
    } catch (e) {
        console.error(e);
    }
    
    setIsModalOpen(false);
  };`
);


// Replace `getWaliKelas`
content = content.replace(
  /const getWaliKelas = \(className: string\) => \{[\s\S]*?return walas \? walas\.name : 'Belum Ditugaskan';\n  \};/,
  `const getWaliKelas = (className: string) => {
    const walas = users.find(u => u.role === 'walas' && u.className === className);
    return walas ? walas.name : 'Belum Ditugaskan';
  };`
);

content = content.replace(
  /mockStudents\.splice\(0, mockStudents\.length, \.\.\.allStudents\);/,
  ""
);

fs.writeFileSync(path, content, 'utf8');
console.log('AdminAcademic done');
