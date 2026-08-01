const fs = require('fs');
const file = 'src/pages/GuruPages.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetOld = `export function Absensi() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  
  const isWalas = user?.role === 'walas';
  const subjects = user?.subjects || [];
  const availableClasses = Array.from(new Set(subjects.map(s => s.className)));
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  const classSubjects = subjects.filter(s => s.className === selectedClass);
  const availableMapel = Array.from(new Set(classSubjects.map(s => s.subjectName)));

  useEffect(() => {
    if (availableMapel.length === 1) {
      setSelectedMapel(availableMapel[0]);
    } else if (!availableMapel.includes(selectedMapel)) {
      setSelectedMapel('');
    }
  }, [selectedClass, availableMapel, selectedMapel]);`;

const targetNew = `export function Absensi() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [dbClasses, setDbClasses] = useState<string[]>([]);

  useEffect(() => {
    apiClient('/crud.php?table=classes').then(data => {
      if (Array.isArray(data)) {
        setDbClasses(data.map((c: any) => c.name));
      }
    }).catch(console.error);

    apiClient('/crud.php?table=students').then(data => {
      if (Array.isArray(data)) {
        setStudentsList(data);
      }
    }).catch(console.error);
  }, []);

  const isWalas = user?.role === 'walas' || user?.roles?.includes('walas');
  const walasClass = user?.className || user?.class_name;
  const subjects = user?.subjects || [];
  const subjectClasses = Array.from(new Set(subjects.map((s: any) => s.className))).filter(Boolean);
  
  const availableClasses = Array.from(new Set([
    ...(walasClass ? [walasClass] : []),
    ...subjectClasses,
    ...dbClasses
  ])).filter(Boolean) as string[];
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMapel, setSelectedMapel] = useState('');

  useEffect(() => {
    if (!selectedClass && availableClasses.length > 0) {
      if (walasClass && availableClasses.includes(walasClass)) {
        setSelectedClass(walasClass);
      } else {
        setSelectedClass(availableClasses[0]);
      }
    }
  }, [availableClasses, walasClass]);

  const classSubjects = subjects.filter((s: any) => s.className === selectedClass);
  let availableMapel = Array.from(new Set(classSubjects.map((s: any) => s.subjectName))).filter(Boolean) as string[];

  if (selectedClass === walasClass || availableMapel.length === 0) {
    if (!availableMapel.includes('Presensi Wali Kelas')) {
      availableMapel = ['Presensi Wali Kelas', ...availableMapel];
    }
  }

  useEffect(() => {
    if (availableMapel.length === 1) {
      setSelectedMapel(availableMapel[0]);
    } else if (!availableMapel.includes(selectedMapel)) {
      setSelectedMapel(availableMapel[0] || '');
    }
  }, [selectedClass, availableMapel, selectedMapel]);`;

code = code.replace(targetOld, targetNew);

// Replace mockStudents.map in Absensi body
code = code.replace(
`              {showStudents ? (
                mockStudents.map((s, i) => {`,
`              {showStudents ? (
                (() => {
                  const filteredDb = studentsList.filter((s: any) => s.class_name === selectedClass || s.className === selectedClass);
                  const filteredMock = mockStudents.filter((s: any) => s.className === selectedClass || s.class_name === selectedClass);
                  const studentData = filteredDb.length > 0 ? filteredDb : (filteredMock.length > 0 ? filteredMock : mockStudents);
                  return studentData.map((s: any, i: number) => {`
);

// Close the wrapper
code = code.replace(
`                    </tr>
                  );
                })
              ) : (`,
`                    </tr>
                  );
                });
                })()
              ) : (`
);

fs.writeFileSync(file, code);
console.log('Patched GuruPages Absensi successfully!');
