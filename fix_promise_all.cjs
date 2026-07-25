const fs = require('fs');
const path = './src/pages/AdminUsers.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `        if (successCount > 0) {
          Promise.all(newUsers.map(async (u) => {
             const payload = {
                name: u.name,
                username: u.username,
                password: u.password,
                role: u.role,
                roles: JSON.stringify(u.roles || [u.role]),
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
             setFeedback({ type: 'success', message: \`Berhasil mengimpor \${successCount} akun Guru & Tendik dari file Excel.\` });
          }).catch((err) => {
             console.error(err);
             setFeedback({ type: 'error', message: \`Berhasil memproses excel namun gagal menyimpan ke database.\` });
          });
        } else {`;

const newCode = `        if (successCount > 0) {
          (async () => {
             try {
                for (const u of newUsers) {
                   const payload = {
                      name: u.name,
                      username: u.username,
                      password: u.password,
                      role: u.role,
                      roles: JSON.stringify(u.roles || [u.role]),
                      gender: u.gender || null,
                      class_name: u.className || null,
                      child_id: u.childId || null,
                      avatar: u.avatar || \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(u.name)}\`,
                   };
                   await apiClient(\`/crud.php?table=users\`, {
                      method: 'POST',
                      body: JSON.stringify(payload),
                   });
                }
                fetchUsers();
                setFeedback({ type: 'success', message: \`Berhasil mengimpor \${successCount} akun Guru & Tendik dari file Excel.\` });
             } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', message: \`Berhasil memproses excel namun gagal menyimpan ke database.\` });
             }
          })();
        } else {`;

if (content.includes('Promise.all(newUsers.map(async (u) => {')) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed AdminUsers.tsx');
} else {
  console.log('Could not find code block in AdminUsers.tsx');
}
