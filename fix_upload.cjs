const fs = require('fs');
const path = './src/pages/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldUploadSuccess = `if (successCount > 0) {
          const updatedList = [...users, ...newUsers];
          setUsers(updatedList);
          mockUsers.splice(0, mockUsers.length, ...updatedList);
          
          setFeedback({ type: 'success', message: \`Berhasil mengimpor \$\{successCount\} akun Guru & Tendik dari file Excel.\` });
        } else {`;

const newUploadSuccess = `if (successCount > 0) {
          Promise.all(newUsers.map(async (u) => {
             const payload = {
                name: u.name,
                username: u.username,
                password: u.password, // already hashed by bcrypt in this script
                role: u.role,
                gender: u.gender || null,
                class_name: u.className || null,
                child_id: u.childId || null,
                avatar: u.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(u.name)}\`,
             };
             await apiClient(\`/crud.php?table=users\`, {
                method: 'POST',
                body: JSON.stringify(payload),
             });
          })).then(() => {
             fetchUsers();
             setFeedback({ type: 'success', message: \`Berhasil mengimpor \$\{successCount\} akun Guru & Tendik dari file Excel.\` });
          }).catch((err) => {
             console.error(err);
             setFeedback({ type: 'error', message: \`Berhasil memproses excel namun gagal menyimpan ke database.\` });
          });
        } else {`;

content = content.replace(oldUploadSuccess, newUploadSuccess);
fs.writeFileSync(path, content, 'utf8');
