const fs = require('fs');

// Patch 1: AdminStudents.tsx
let file = 'src/pages/AdminStudents.tsx';
let code = fs.readFileSync(file, 'utf8');

// Update roles definition & student filter
const oldRoleSetup = `  useEffect(() => {
    if ((user?.role === 'walas' || user?.roles?.includes('walas')) && walasClass) {
      setSelectedClassFilter(walasClass);
    }
  }, [user, walasClass]);
  const canManage = ["admin", "kamad", "wakakurikulum", "wakakesiswaan"].includes(user?.role || "");`;

const newRoleSetup = `  const isWalas = user?.role === 'walas' || user?.roles?.includes('walas') || Boolean(user?.className || user?.class_name);
  const isAdminOrKesiswaan = ["admin", "superadmin", "admin_utama", "kamad", "wakakurikulum", "wakakesiswaan", "kesiswaan"].includes(user?.role || "") || (user?.roles && user.roles.some((r: string) => ["admin", "superadmin", "kesiswaan", "wakakurikulum"].includes(r)));
  const isPlainGuru = (user?.role === 'guru' || user?.roles?.includes('guru')) && !isWalas && !isAdminOrKesiswaan;

  useEffect(() => {
    if (isWalas && walasClass) {
      setSelectedClassFilter(walasClass);
    }
  }, [isWalas, walasClass]);
  const canManage = ["admin", "kamad", "wakakurikulum", "wakakesiswaan"].includes(user?.role || "");`;

code = code.replace(oldRoleSetup, newRoleSetup);

// Update filteredStudents calculation
const oldFiltered = `  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = !selectedClassFilter || s.className === selectedClassFilter;
    return matchesSearch && matchesClass;
  });`;

const newFiltered = `  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.className.toLowerCase().includes(searchQuery.toLowerCase());
    
    const activeClassFilter = (isWalas && !isAdminOrKesiswaan && walasClass) ? walasClass : selectedClassFilter;
    const matchesClass = !activeClassFilter || s.className === activeClassFilter;
    return matchesSearch && matchesClass;
  });`;

code = code.replace(oldFiltered, newFiltered);

// Wrap student table rendering in check for isPlainGuru
const oldCardHeader = `{activeTab === 'siswa' && (
        <>
        <Card>`;

const newCardHeader = `{activeTab === 'siswa' && (
        <>
        {isPlainGuru ? (
          <Card className="border-amber-200 bg-amber-50 shadow-sm">
            <CardContent className="p-8 text-center space-y-3">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-amber-800">Akses Data Siswa Terbatas</h3>
              <p className="text-sm text-amber-700 max-w-md mx-auto">
                Akses Data Siswa hanya diperuntukkan bagi Wali Kelas, Tim Kesiswaan, dan Administrator. Sebagai Guru Mata Pelajaran, Anda tidak dapat melihat data siswa secara menyeluruh, tetapi Anda dapat mengabsen siswa pada menu <strong>Absensi Siswa</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/absensi')}
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
                >
                  Buka Menu Absensi Siswa
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
        <Card>`;

code = code.replace(oldCardHeader, newCardHeader);

// Close the wrapper before </>
const oldEndTab = `        </Card>
        </>
      )}`;

const newEndTab = `        </Card>
        )}
        </>
      )}`;

code = code.replace(oldEndTab, newEndTab);

fs.writeFileSync(file, code);
console.log('Patched AdminStudents.tsx successfully!');

// Patch 2: GuruPages.tsx
file = 'src/pages/GuruPages.tsx';
code = fs.readFileSync(file, 'utf8');

// Update Absensi component to fetch schedules & enforce schedule check
const oldAbsensiStart = `export function Absensi() {
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
  }, []);`;

const newAbsensiStart = `export function Absensi() {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<Record<string, { status: string; ket: string }>>({});
  const [studentsList, setStudentsList] = useState<any[]>([]);
  const [dbClasses, setDbClasses] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [schedulesLoaded, setSchedulesLoaded] = useState(false);

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

    apiClient('/crud.php?table=schedules').then(data => {
      if (Array.isArray(data)) {
        setSchedules(data);
      }
      setSchedulesLoaded(true);
    }).catch(err => {
      console.error(err);
      setSchedulesLoaded(true);
    });
  }, []);`;

code = code.replace(oldAbsensiStart, newAbsensiStart);

// Schedule validation logic
const oldHandleSave = `  const handleSave = () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    window.alert("Absensi berhasil disimpan!");
  };`;

const newHandleSave = `  const hasScheduleForClass = !selectedClass || schedules.length === 0 || schedules.some((s: any) => s.class_name === selectedClass || s.rombel === selectedClass);
  const hasScheduleForSubject = selectedMapel === 'Presensi Wali Kelas' || schedules.length === 0 || schedules.some((s: any) => (s.class_name === selectedClass || s.rombel === selectedClass) && (s.subject_name === selectedMapel || s.mapel === selectedMapel));
  const isScheduleCreated = schedules.length > 0;

  const handleSave = () => {
    if (!selectedClass) {
      window.alert("Pilih kelas terlebih dahulu!");
      return;
    }
    if (availableMapel.length > 0 && !selectedMapel) {
      window.alert("Pilih mata pelajaran terlebih dahulu!");
      return;
    }
    if (!isScheduleCreated) {
      window.alert("Jadwal belum dibuat oleh Wakakurikulum dan Admin! Pengisian absensi belum dapat diproses.");
      return;
    }
    if (selectedMapel !== 'Presensi Wali Kelas' && !hasScheduleForSubject) {
      window.alert(\`Jadwal pelajaran \${selectedMapel} untuk \${selectedClass} belum dibuat oleh Wakakurikulum dan Admin!\`);
      return;
    }
    window.alert("Absensi berhasil disimpan!");
  };`;

code = code.replace(oldHandleSave, newHandleSave);

// Also render a schedule warning banner in Absensi if schedules are not created
const oldShowStudents = `  const showStudents = selectedClass !== '' && (availableMapel.length === 0 || selectedMapel !== '');`;

const newShowStudents = `  const showStudents = selectedClass !== '' && (availableMapel.length === 0 || selectedMapel !== '');
  const isScheduleValid = isScheduleCreated && (selectedMapel === 'Presensi Wali Kelas' || hasScheduleForSubject);`;

code = code.replace(oldShowStudents, newShowStudents);

const oldTopBarJSX = `      {/* Top Bar */}
      <Card className="border-slate-200 shadow-sm">`;

const newTopBarJSX = `      {/* Schedule Warning Banner if not created by Wakakurikulum/Admin */}
      {schedulesLoaded && !isScheduleCreated && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              <strong>Jadwal Pelajaran Belum Dibuat:</strong> Pengisian absensi baru dapat dilakukan setelah jadwal pelajaran dibuat oleh Wakakurikulum atau Administrator.
            </p>
          </CardContent>
        </Card>
      )}

      {schedulesLoaded && isScheduleCreated && selectedClass && selectedMapel && selectedMapel !== 'Presensi Wali Kelas' && !hasScheduleForSubject && (
        <Card className="border-amber-200 bg-amber-50 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p className="text-xs sm:text-sm font-medium">
              Jadwal pelajaran untuk mata pelajaran <strong>{selectedMapel}</strong> di kelas <strong>{selectedClass}</strong> belum dibuat oleh Wakakurikulum / Admin.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Top Bar */}
      <Card className="border-slate-200 shadow-sm">`;

code = code.replace(oldTopBarJSX, newTopBarJSX);

fs.writeFileSync(file, code);
console.log('Patched GuruPages.tsx successfully!');
