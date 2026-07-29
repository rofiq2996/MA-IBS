const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardAdmin.tsx', 'utf8');

const targetState = `  const [announcements, setAnnouncements] = useState<any[]>([]);`;
const replaceState = `  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [activeTermName, setActiveTermName] = useState<string>('-');
  const [activeTermSemester, setActiveTermSemester] = useState<string>('-');

  useEffect(() => {
    const stored = localStorage.getItem('mockAcademicTerms');
    if (stored) {
      try {
        const terms = JSON.parse(stored);
        const activeTerm = terms.find((t: any) => t.isActive);
        if (activeTerm) {
          setActiveTermName(activeTerm.name);
          setActiveTermSemester(activeTerm.semester === 'ganjil' ? 'Ganjil' : 'Genap');
        } else if (terms.length > 0) {
          setActiveTermName(terms[0].name);
          setActiveTermSemester(terms[0].semester === 'ganjil' ? 'Ganjil' : 'Genap');
        }
      } catch (e) {}
    }
  }, []);`;

code = code.replace(targetState, replaceState);

const targetUI = `        <div className="bg-emerald-600 p-4 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Tahun Ajaran
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-xl font-black">-</span>
            <span className="text-[10px] bg-emerald-400/30 px-2 py-1 rounded backdrop-blur-sm font-bold uppercase tracking-wider">-</span>
          </div>
        </div>`;

const replaceUI = `        <div className="bg-emerald-600 p-4 rounded-xl shadow-md text-white flex flex-col justify-between">
          <div className="text-xs font-bold text-emerald-200 uppercase tracking-widest flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" /> Tahun Ajaran
          </div>
          <div className="flex items-end justify-between mt-2">
            <span className="text-xl font-black">{activeTermName}</span>
            <span className="text-[10px] bg-emerald-400/30 px-2 py-1 rounded backdrop-blur-sm font-bold uppercase tracking-wider">{activeTermSemester}</span>
          </div>
        </div>`;

code = code.replace(targetUI, replaceUI);

fs.writeFileSync('src/pages/DashboardAdmin.tsx', code);
