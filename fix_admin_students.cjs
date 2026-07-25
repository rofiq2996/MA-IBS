const fs = require('fs');
const path = './src/pages/AdminStudents.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldCode = `        if (newStudents.length > 0) {
          const updatedList = [...students, ...newStudents];
          setStudents(updatedList);
          mockStudents.splice(0, mockStudents.length, ...updatedList);
          
          if (newUsers.length > 0) {
             const updatedUserList = [...users, ...newUsers];
             setUsers(updatedUserList);
             mockUsers.splice(0, mockUsers.length, ...updatedUserList);
          }
          
          setFeedback({ type: 'success', message: \`\${newStudents.length} siswa diunggah, \${newUsers.length} akun dibuat.\` });
        } else {`;

const newCode = `        if (newStudents.length > 0) {
          (async () => {
             setFeedback({ type: 'info', message: \`Mengunggah \${newStudents.length} siswa...\` });
             try {
                for (const s of newStudents) {
                   await apiClient('/crud.php?table=students', {
                      method: 'POST',
                      body: JSON.stringify({
                         name: s.name,
                         nis: s.nis,
                         class_name: s.className,
                         gender: s.gender,
                         behavior_score: 100
                      }),
                   });
                }
                for (const u of newUsers) {
                   await apiClient('/crud.php?table=users', {
                      method: 'POST',
                      body: JSON.stringify({
                         name: u.name,
                         username: u.username,
                         password: u.password,
                         role: u.role,
                         roles: JSON.stringify([u.role]),
                         avatar: u.avatar
                      }),
                   });
                }
                fetchData();
                setFeedback({ type: 'success', message: \`\${newStudents.length} siswa diunggah, \${newUsers.length} akun dibuat.\` });
             } catch (err) {
                console.error(err);
                setFeedback({ type: 'error', message: 'Berhasil memproses excel namun gagal menyimpan ke database.' });
             }
          })();
        } else {`;

if (content.includes('if (newStudents.length > 0) {')) {
  content = content.replace(oldCode, newCode);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Fixed AdminStudents.tsx');
} else {
  console.log('Could not find code block in AdminStudents.tsx');
}
