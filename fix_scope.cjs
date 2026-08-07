const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

// Remove from Absensi
file = file.replace(
  `  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [jurnals, setJurnals] = useState<any[]>([]);
  const [ibadahSiswa, setIbadahSiswa] = useState<any[]>([]);
  
  useEffect(() => {
    apiClient('/crud.php?table=classes').then(data => {`,
  `  useEffect(() => {
    apiClient('/crud.php?table=classes').then(data => {`
);

// Remove apiClient fetching from Absensi
file = file.replace(
  `    apiClient('/crud.php?table=teaching_assignments').then(data => {
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
  }, []);`,
  `    apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) {
        setTeachingAssignments(data);
      }
    }).catch(console.error);
  }, []);`
);

// Add to Laporan
file = file.replace(
  `  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);`,
  `  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);
  const [studentAttendance, setStudentAttendance] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [jurnals, setJurnals] = useState<any[]>([]);
  const [ibadahSiswa, setIbadahSiswa] = useState<any[]>([]);`
);

file = file.replace(
  `    apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) {
        setTeachingAssignments(data);
      }
    }).catch(console.error);
  }, []);`,
  `    apiClient('/crud.php?table=teaching_assignments').then(data => {
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
  }, []);`
);

fs.writeFileSync('src/pages/GuruPages.tsx', file);
