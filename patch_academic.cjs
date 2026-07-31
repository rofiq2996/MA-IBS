const fs = require('fs');
const file = 'src/pages/AdminAcademic.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
`  const getWaliKelas = (className: string) => {
    const walas = users.find(u => u.role === 'walas' && (u.class_name || u.className) === className);
    return walas ? walas.name : 'Belum Ditugaskan';
  };`,
`  const getWaliKelas = (c: any) => {
    if (c.wali_kelas_id) {
       const w = users.find(u => u.id === c.wali_kelas_id);
       if (w) return w.name;
    }
    const walas = users.find(u => u.role === 'walas' && (u.class_name || u.className) === c.name);
    return walas ? walas.name : 'Belum Ditugaskan';
  };`);

code = code.replace(
`Wali Kelas: <span className="font-semibold text-slate-700">{getWaliKelas(c.name)}</span>`,
`Wali Kelas: <span className="font-semibold text-slate-700">{getWaliKelas(c)}</span>`
);

fs.writeFileSync(file, code);
