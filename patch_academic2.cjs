const fs = require('fs');
const file = 'src/pages/AdminAcademic.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`    const walas = users.find(u => u.role === 'walas' && (u.class_name || u.className) === c.name);
    setWaliKelasId(walas ? walas.id : '');`,
`    const walas = users.find(u => u.id === c.wali_kelas_id) || users.find(u => u.role === 'walas' && (u.class_name || u.className) === c.name);
    setWaliKelasId(walas ? String(walas.id) : '');`
);

fs.writeFileSync(file, code);
