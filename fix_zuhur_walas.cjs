const fs = require('fs');
let file = fs.readFileSync('src/pages/WalasPages.tsx', 'utf8');

const dateState = `  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);`;
file = file.replace(/const selectedClass = user\?\.className \|\| user\?\.class_name \|\| '';/g, dateState + "\n  const selectedClass = user?.className || user?.class_name || '';");

file = file.replace(/const todayKey = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g, "const todayKey = selectedDate;");
file = file.replace(/const today = new Date\(\)\.toLocaleDateString\('id-ID', \{[\s\S]*?\}\);/g, "const today = new Date(selectedDate).toLocaleDateString('id-ID', {\n    day: '2-digit',\n    month: '2-digit',\n    year: 'numeric'\n  });");
file = file.replace(/const todayKey = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g, "const todayKey = selectedDate;"); // Replace any remaining

// Wait, the useEffect for SholatZuhurWalas should depend on selectedDate
file = file.replace(/\}, \[selectedClass, students\]\);/g, "}, [selectedClass, students, selectedDate]);");

const uiRegex = /<h1 className="text-xl font-bold tracking-tight text-slate-800">Absensi Sholat Zuhur<\/h1>\s*<p className="text-sm text-slate-500 mt-1">Siswa binaan kelas \{selectedClass\}<\/p>\s*<\/div>/g;

const uiReplacement = `<h1 className="text-xl font-bold tracking-tight text-slate-800">Absensi Sholat Zuhur</h1>
            <p className="text-sm text-slate-500 mt-1">Siswa binaan kelas {selectedClass}</p>
          </div>
          <div className="w-full sm:w-[200px]">
             <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 font-bold text-slate-700"
              />
          </div>`;

file = file.replace(uiRegex, uiReplacement);

// Handle save todayKey
file = file.replace(/const todayKeySave = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/g, "const todayKeySave = selectedDate;");
// wait let's check what handleSave uses
fs.writeFileSync('src/pages/WalasPages.tsx', file);
