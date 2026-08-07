const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

// For presensi
file = file.replace(
  /"Kelas": selectedClass,\s*"Mata Pelajaran": selectedSubject,\s*"Hadir \(Hari\)/g,
  '"Hadir (Hari)'
);

// For sholat_dhuha / sholat_zuhur
file = file.replace(
  /"Kelas": selectedClass,\s*"Jamaah": row\.jamaah/g,
  '"Jamaah": row.jamaah'
);

// For jurnal
file = file.replace(
  /"Tanggal": row\.tanggal,\s*"Kelas": row\.kelas,\s*"Mata Pelajaran": row\.mataPelajaran,\s*"Materi Pokok"/g,
  '"Tanggal": row.tanggal,\n        "Materi Pokok"'
);

// For analisis
file = file.replace(
  /"Kelas": selectedClass,\s*"Mata Pelajaran": selectedSubject,\s*"Nilai Awal/g,
  '"Nilai Awal'
);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
