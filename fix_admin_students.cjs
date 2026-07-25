const fs = require('fs');
const path = './src/pages/AdminStudents.tsx';
let content = fs.readFileSync(path, 'utf8');

// add apiClient import
content = content.replace(
  "import bcrypt from 'bcryptjs';",
  "import bcrypt from 'bcryptjs';\nimport { apiClient } from '../lib/apiClient';"
);

// replace state
content = content.replace(
  "const [students, setStudents] = useState<Student[]>(mockStudents);",
  "const [students, setStudents] = useState<Student[]>([]);"
);
content = content.replace(
  "const [users, setUsers] = useState<User[]>(mockUsers);",
  "const [users, setUsers] = useState<User[]>([]);"
);
content = content.replace(
  "const [classes] = useState(mockClasses);",
  "const [classes, setClasses] = useState<{name:string}[]>([]);"
);

// Add fetch function
const fetchCode = `  const fetchData = async () => {
    try {
      const [studentsData, classesData, usersData] = await Promise.all([
        apiClient('/crud.php?table=students'),
        apiClient('/crud.php?table=classes'),
        apiClient('/crud.php?table=users')
      ]);
      const mappedStudents = studentsData.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        nis: s.nis,
        className: s.class_name,
        gender: s.gender,
        parentId: s.parent_id ? String(s.parent_id) : undefined,
        behaviorScore: s.behavior_score ? Number(s.behavior_score) : 100
      }));
      setStudents(mappedStudents);
      setClasses(classesData.map((c: any) => ({ name: c.name })));
      const mappedUsers = usersData.map((u: any) => ({
        id: String(u.id),
        name: u.name,
        username: u.username,
        role: u.role,
        roles: [u.role],
        gender: u.gender,
      }));
      setUsers(mappedUsers);
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Gagal memuat data dari database.' });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
`;

content = content.replace(
  /useEffect\(\(\) => \{\n    \n  \}, \[students\]\);/,
  fetchCode
);

// Fix Delete
content = content.replace(
  /const confirmDeleteStudent = \(\) => \{[\s\S]*?setFeedback\(\{ type: 'success', message: 'Data siswa berhasil dihapus\.' \}\);\n    \}\n  \};/,
  `const confirmDeleteStudent = async () => {
    if (deleteConfirmId) {
      try {
        await apiClient(\`/crud.php?table=students&id=\${deleteConfirmId}\`, { method: 'DELETE' });
        setFeedback({ type: 'success', message: 'Data siswa berhasil dihapus.' });
        fetchData();
      } catch (e) {
        setFeedback({ type: 'error', message: 'Gagal menghapus siswa.' });
      }
      setDeleteConfirmId(null);
    }
  };`
);

// Fix Save
content = content.replace(
  /const handleSave = \(e: React\.FormEvent\) => \{[\s\S]*?setFeedback\(\{ type: 'success', message: `Data siswa berhasil \$\{editingId \? 'diperbarui' : 'ditambahkan'\}\.` \}\);\n  \};/,
  `const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentNis.trim() || !studentClassName.trim()) {
      setFeedback({ type: 'error', message: 'Nama, NIS, dan Kelas wajib diisi.' });
      return;
    }

    const payload: any = {
      name: studentName.trim(),
      nis: studentNis.trim(),
      class_name: studentClassName,
      gender: studentGender,
    };

    if (editingId) {
      try {
        await apiClient(\`/crud.php?table=students&id=\${editingId}\`, { method: 'PUT', body: JSON.stringify(payload) });
        setFeedback({ type: 'success', message: 'Data siswa berhasil diperbarui.' });
      } catch (e) {
        setFeedback({ type: 'error', message: 'Gagal memperbarui siswa.' });
        return;
      }
    } else {
      try {
        await apiClient('/crud.php?table=students', { method: 'POST', body: JSON.stringify(payload) });
        setFeedback({ type: 'success', message: 'Data siswa berhasil ditambahkan.' });
      } catch (e) {
        setFeedback({ type: 'error', message: 'Gagal menambahkan siswa.' });
        return;
      }
    }
    setIsModalOpen(false);
    fetchData();
  };`
);

// Fix Upload Excel
const newUploadSuccess = `if (successCount > 0) {
          Promise.all(newStudents.map(async (s) => {
             const payload = {
                name: s.name,
                nis: s.nis,
                class_name: s.className,
                gender: s.gender,
             };
             await apiClient(\`/crud.php?table=students\`, {
                method: 'POST',
                body: JSON.stringify(payload),
             });
          })).then(() => {
             fetchData();
             setFeedback({ type: 'success', message: \`Berhasil mengimpor \$\{successCount\} siswa dari file Excel.\` });
          }).catch((err) => {
             console.error(err);
             setFeedback({ type: 'error', message: \`Berhasil memproses excel namun gagal menyimpan ke database.\` });
          });
        } else {`;

content = content.replace(/if \(successCount > 0\) \{[\s\S]*?mockStudents\.splice\(0, mockStudents\.length, \.\.\.updatedList\);\n          \n          setFeedback\(\{ type: 'success', message: `Berhasil mengimpor \$\{successCount\} siswa dari file Excel\.` \}\);\n        \} else \{/, newUploadSuccess);

fs.writeFileSync(path, content, 'utf8');
console.log('AdminStudents done');
