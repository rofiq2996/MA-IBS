const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Imports
const importToAdd = `
import { SiswaHafalan } from './pages/SiswaHafalan';
import { GuruQuranHafalan } from './pages/GuruQuranHafalan';
import { KesiswaanSP } from './pages/KesiswaanSP';
`;

code = code.replace("import { DashboardSiswa } from './pages/DashboardSiswa';", importToAdd + "\nimport { DashboardSiswa } from './pages/DashboardSiswa';");

// Routes
// Kesiswaan SP route
const kesiswaanRoute = `
            {/* Waka Kesiswaan specific */}
            <Route path="kesiswaan/sp" element={<KesiswaanSP />} />
`;
code = code.replace("{/* Ortu Routes */}", kesiswaanRoute + "\n            {/* Ortu Routes */}");

// Guru Quran Hafalan route
const quranRoute = `
            {/* Guru Quran specific */}
            <Route path="guru-quran/hafalan" element={<GuruQuranHafalan />} />
`;
code = code.replace("{/* Ortu Routes */}", quranRoute + "\n            {/* Ortu Routes */}");

// Siswa Hafalan route
const siswaRoute = `
            <Route path="siswa/hafalan" element={<SiswaHafalan />} />
`;
code = code.replace("<Route path=\"siswa-nilai\" element={<SiswaNilai />} />", "<Route path=\"siswa-nilai\" element={<SiswaNilai />} />\n" + siswaRoute);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx");
