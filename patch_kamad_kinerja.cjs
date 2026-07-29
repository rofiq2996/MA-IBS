const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Replace activeTab type
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'wali_kelas' | 'pelanggaran'>('all');",
  "const [activeTab, setActiveTab] = useState<'all' | 'guru_mapel' | 'walas' | 'guru_quran' | 'pustakawan' | 'bk' | 'pelanggaran'>('all');"
);

// Replace filter options
const oldFilterOptions = `  const filterOptions = [
    { value: 'all', label: 'Semua Staf' },
    { value: 'guru_mapel', label: 'Guru Mapel' },
    { value: 'wali_kelas', label: 'Wali Kelas' },
    { value: 'pelanggaran', label: 'Pelanggaran Kinerja' },
  ];`;

const newFilterOptions = `  const filterOptions = [
    { value: 'all', label: 'Semua Staf' },
    { value: 'walas', label: 'Wali Kelas' },
    { value: 'guru_mapel', label: 'Guru Mapel' },
    { value: 'guru_quran', label: 'Guru Qur\\'an' },
    { value: 'pustakawan', label: 'Pustakawan' },
    { value: 'bk', label: 'Guru BK' },
    { value: 'pelanggaran', label: 'Pelanggaran Kinerja' },
  ];`;

code = code.replace(oldFilterOptions, newFilterOptions);

// Update filteredList
const oldFilteredList = `  const filteredList = stafList.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'guru_mapel') return s.category === 'guru_mapel';
    if (activeTab === 'wali_kelas') return s.category === 'wali_kelas';
    if (activeTab === 'pelanggaran') return s.tasks.some((t: any) => t.status === 'terlewat');
    return true;
  });`;

const newFilteredList = `  const filteredList = stafList.filter(s => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pelanggaran') return s.tasks.some((t: any) => t.status === 'terlewat');
    return s.category === activeTab;
  });`;

code = code.replace(oldFilteredList, newFilteredList);

// Update fetchUsers mapping
const oldMapping = `        const mappedStaf = filteredUsers.map((u: any, index: number) => {
          const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
          
          let category = 'guru_mapel';
          if (r.includes('walas')) category = 'wali_kelas';

          let mainRole = 'Guru Mapel';
          if (r.includes('walas')) mainRole = 'Wali Kelas';`;

const newMapping = `        const mappedStaf = filteredUsers.map((u: any, index: number) => {
          const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
          
          let category = 'guru_mapel';
          let mainRole = 'Guru Mapel';
          
          if (r.includes('walas')) {
            category = 'walas';
            mainRole = 'Wali Kelas';
          } else if (r.includes('guru_quran')) {
            category = 'guru_quran';
            mainRole = 'Guru Qur\\'an';
          } else if (r.includes('pustakawan')) {
            category = 'pustakawan';
            mainRole = 'Pustakawan';
          } else if (r.includes('bk')) {
            category = 'bk';
            mainRole = 'Guru BK';
          }`;

code = code.replace(oldMapping, newMapping);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
