const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

file = file.replace(
  `useState<'presensi' | 'nilai' | 'jurnal' | 'analisis' | 'sholat_dhuha'>('presensi')`,
  `useState<'presensi' | 'nilai' | 'jurnal' | 'analisis' | 'sholat_dhuha' | 'sholat_zuhur'>('presensi')`
);

file = file.replace(
  `<option value="sholat_dhuha">Laporan Sholat Dhuha</option>`,
  `<option value="sholat_dhuha">Laporan Sholat Dhuha</option>
                  <option value="sholat_zuhur">Laporan Sholat Zuhur</option>`
);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
