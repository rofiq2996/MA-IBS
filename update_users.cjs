const fs = require('fs');
const path = './src/pages/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

// Add apiClient import
content = content.replace(
  "import * as XLSX from 'xlsx';",
  "import * as XLSX from 'xlsx';\nimport { apiClient } from '../lib/apiClient';"
);

// Replace useState mockUsers
content = content.replace(
  "const [users, setUsers] = useState<User[]>(mockUsers);",
  "const [users, setUsers] = useState<User[]>([]);"
);

// Replace empty useEffect with fetchUsers
content = content.replace(
  "// Synchronize state changes to localStorage\n  useEffect(() => {\n    \n  }, [users]);",
  `const fetchUsers = async () => {
    try {
      const data = await apiClient('/crud.php?table=users');
      const mapped = data.map((u: any) => ({
        id: String(u.id),
        name: u.name,
        username: u.username,
        password: u.password,
        role: u.role,
        roles: [u.role],
        avatar: u.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(u.name)}\`,
        gender: u.gender,
        className: u.class_name,
        childId: u.child_id ? String(u.child_id) : undefined,
      }));
      setUsers(mapped);
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', message: 'Gagal memuat data pengguna dari database.' });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);`
);

const handleDelete = `const confirmDeleteUser = async () => {
    if (deleteConfirmId) {
      try {
        await apiClient(\`/crud.php?table=users&id=\${deleteConfirmId}\`, { method: 'DELETE' });
        setFeedback({ type: 'success', message: 'Data pengguna berhasil dihapus.' });
        fetchUsers();
      } catch (e) {
        setFeedback({ type: 'error', message: 'Gagal menghapus pengguna.' });
      }
      setDeleteConfirmId(null);
    }
  };`;

content = content.replace(
  /const confirmDeleteUser = \(\) => \{[\s\S]*?setFeedback\(\{ type: 'success', message: 'Data pengguna berhasil dihapus\.' \}\);\n    \}\n  \};/,
  handleDelete
);

const handleSaveStr = `const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim()) {
      setFeedback({ type: 'error', message: 'Nama lengkap wajib diisi.' });
      return;
    }

    if (userRoles.length === 0) {
      setFeedback({ type: 'error', message: 'Minimal pilih satu peran pengguna.' });
      return;
    }

    let generatedUsername = userUsername.trim();
    if (!editingId) {
      const nameParts = userName.trim().split(' ').filter(Boolean);
      generatedUsername = nameParts[0].toLowerCase();
      const isStaff = userRoles.some(r => r !== 'ortu' && r !== 'siswa');
      if (isStaff) {
        let currentUsername = generatedUsername;
        let counter = 1;
        let finalUsername = currentUsername;
        while (users.some(u => u.username === finalUsername)) {
          finalUsername = \`\${currentUsername}\${counter}\`;
          counter++;
        }
        generatedUsername = finalUsername;
      }
    }
    
    const hashedPassword = userPassword.trim() ? bcrypt.hashSync(userPassword.trim(), 10) : '';

    const payload: any = {
        name: userName.trim(),
        username: generatedUsername,
        role: userRoles[0],
        gender: userGender || null,
        class_name: userRoles.includes('walas') ? userClassName : null,
        child_id: userRoles.includes('ortu') ? userChildId : null,
        avatar: \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(userName)}\`,
    };

    if (editingId) {
      if (hashedPassword) {
         payload.password = hashedPassword;
      }
      try {
        await apiClient(\`/crud.php?table=users&id=\${editingId}\`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setFeedback({ type: 'success', message: 'Data pengguna berhasil diperbarui.' });
      } catch (e) {
         setFeedback({ type: 'error', message: 'Gagal memperbarui pengguna.' });
         return;
      }
    } else {
      payload.password = hashedPassword || bcrypt.hashSync('12345', 10);
      try {
        await apiClient(\`/crud.php?table=users\`, {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setFeedback({ type: 'success', message: 'Data pengguna berhasil ditambahkan.' });
      } catch (e) {
         setFeedback({ type: 'error', message: 'Gagal menambahkan pengguna.' });
         return;
      }
    }
    
    setIsModalOpen(false);
    fetchUsers();
  };`;

content = content.replace(
  /const handleSave = \(e: React\.FormEvent\) => \{[\s\S]*?setIsModalOpen\(false\);\n    setFeedback\(\{ type: 'success', message: `Data pengguna berhasil \$\{editingId \? 'diperbarui' : 'ditambahkan'\}\.` \}\);\n  \};/,
  handleSaveStr
);


fs.writeFileSync(path, content, 'utf8');
