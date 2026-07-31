const fs = require('fs');
const file = 'src/pages/WalasPages.tsx';
let code = fs.readFileSync(file, 'utf8');

// For PemantauanPagi
code = code.replace(
`export function PemantauanPagi() {
  const [monitoring, setMonitoring] = useState<Record<string, { kebersihan: string; seragam: string; ketSeragam: string }>>(() => {
    const initial: Record<string, { kebersihan: string; seragam: string; ketSeragam: string }> = {};
    mockStudents.forEach(s => {
      initial[s.id] = { kebersihan: 'Piket', seragam: 'Lengkap', ketSeragam: '' };
    });
    return initial;
  });`,
`export function PemantauanPagi() {
  const students = useWalasStudents();
  const [monitoring, setMonitoring] = useState<Record<string, { kebersihan: string; seragam: string; ketSeragam: string }>>({});
  
  useEffect(() => {
    setMonitoring(prev => {
      const initial = { ...prev };
      students.forEach(s => {
        if (!initial[s.id]) {
          initial[s.id] = { kebersihan: 'Piket', seragam: 'Lengkap', ketSeragam: '' };
        }
      });
      return initial;
    });
  }, [students]);`
);
code = code.replace(/\{mockStudents\.map\(\(s, index\)/g, `{students.map((s, index)`);

// For NilaiSikap
code = code.replace(
`export function NilaiSikap() {
  const [grades, setGrades] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    mockStudents.forEach(s => {
      initial[s.id] = 'B';
    });
    return initial;
  });`,
`export function NilaiSikap() {
  const students = useWalasStudents();
  const [grades, setGrades] = useState<Record<string, string>>({});
  useEffect(() => {
    setGrades(prev => {
      const initial = { ...prev };
      students.forEach(s => {
        if (!initial[s.id]) initial[s.id] = 'B';
      });
      return initial;
    });
  }, [students]);`
);

// For SholatZuhurWalas
code = code.replace(
`export function SholatZuhurWalas() {
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  
  // Just use mock classes for now
  const availableClasses = Array.from(new Set(mockStudents.map(s => s.className)));
  const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');`,
`export function SholatZuhurWalas() {
  const students = useWalasStudents();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  const { user } = useAuth();
  
  const selectedClass = user?.className || user?.class_name || '';
  const availableClasses = [selectedClass];`
);
code = code.replace(/mockStudents\.filter\(s => s\.className === selectedClass\)\.map/g, `students.map`);

// For PrestasiWalas
code = code.replace(
`export function PrestasiWalas() {
  const [studentId, setStudentId] = useState(mockStudents[0]?.id || '');`,
`export function PrestasiWalas() {
  const students = useWalasStudents();
  const [studentId, setStudentId] = useState('');
  useEffect(() => {
    if (students.length > 0 && !studentId) {
       setStudentId(students[0].id);
    }
  }, [students]);`
);
code = code.replace(
`options={mockStudents.map(s => ({ value: String(s.id), label: s.name }))}`,
`options={students.map(s => ({ value: String(s.id), label: s.name }))}`
);

// For BkWalas
code = code.replace(
`export function BkWalas() {
  const [cases, setCases] = useState<{
    id: string;
    tanggal: string;
    namaSiswa: string;
    kasus: string;
    tindakLanjut: string;
    status: string;
  }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(mockStudents[0]?.id || '');`,
`export function BkWalas() {
  const students = useWalasStudents();
  const [cases, setCases] = useState<{
    id: string;
    tanggal: string;
    namaSiswa: string;
    kasus: string;
    tindakLanjut: string;
    status: string;
  }[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState('');
  useEffect(() => {
    if (students.length > 0 && !studentId) {
       setStudentId(students[0].id);
    }
  }, [students]);`
);
code = code.replace(
`const student = mockStudents.find(s => s.id === studentId);`,
`const student = students.find(s => s.id === studentId);`
);
code = code.replace(
`setStudentId(mockStudents[0]?.id || '');`,
`setStudentId(students[0]?.id || '');`
);
code = code.replace(
`options={mockStudents.map(s => ({ value: String(s.id), label: s.name }))}`,
`options={students.map(s => ({ value: String(s.id), label: s.name }))}`
);


fs.writeFileSync(file, code);
