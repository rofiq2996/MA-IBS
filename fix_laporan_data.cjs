const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const regex = /apiClient\('\/crud.php\?table=teaching_assignments'\)\.then\(data => \{\s+if \(Array\.isArray\(data\)\) \{\s+setTeachingAssignments\(data\);\s+\}\s+\}\)\.catch\(console\.error\);\s+\}, \[\]\);/g;

const newFetch = `apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) {
        setTeachingAssignments(data);
      }
    }).catch(console.error);

    apiClient('/crud.php?table=student_attendance').then(data => {
      if (Array.isArray(data)) setStudentAttendance(data);
    }).catch(console.error);

    apiClient('/crud.php?table=grades').then(data => {
      if (Array.isArray(data)) setGrades(data);
    }).catch(console.error);

    apiClient('/crud.php?table=laporan_harian').then(data => {
      if (Array.isArray(data)) setJurnals(data);
    }).catch(console.error);

    apiClient('/crud.php?table=ibadah_siswa').then(data => {
      if (Array.isArray(data)) setIbadahSiswa(data);
    }).catch(console.error);
  }, []);`;

file = file.replace(regex, newFetch);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
