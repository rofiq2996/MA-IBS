const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminKenaikanKelas.tsx', 'utf8');

code = code.replace(
  "const targetOptions = [...classOptions, { value: 'LULUS', label: 'Lulus / Alumni' }];",
  "const targetOptions = [{ value: 'X', label: 'Tingkat X' }, { value: 'XI', label: 'Tingkat XI' }, { value: 'XII', label: 'Tingkat XII' }, { value: 'LULUS', label: 'Lulus / Alumni' }];"
);

// We need to modify handleKenaikan
// Let's replace the return statement inside the map
code = code.replace(
  "className: targetClass,",
  "grade: targetClass,\n            className: targetClass === 'LULUS' ? 'LULUS' : '',"
);

// Change label "Kelas Tujuan / Status" to "Jenjang Tujuan / Status"
code = code.replace(
  "Kelas Tujuan / Status",
  "Jenjang Tujuan / Status"
);

code = code.replace(
  "Kelas tujuan tidak boleh sama dengan kelas asal.",
  "Tujuan tidak boleh sama dengan jenjang asal."
);

code = code.replace(
  "Pilih kelas tujuan terlebih dahulu.",
  "Pilih jenjang tujuan terlebih dahulu."
);

code = code.replace(
  "targetClass === 'LULUS' ? 'Status Lulus' : 'Kelas ' + targetClass",
  "targetClass === 'LULUS' ? 'Status Lulus' : 'Tingkat ' + targetClass"
);

fs.writeFileSync('src/pages/AdminKenaikanKelas.tsx', code);
