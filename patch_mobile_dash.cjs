const fs = require('fs');
let code = fs.readFileSync('src/pages/MobileDashboard.tsx', 'utf8');

const targetState = `  const [announcements, setAnnouncements] = useState<any[]>([]);`;
const replaceState = `  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoadingSchedules(true);
        const data = await apiClient('/crud.php?table=schedules');
        if (Array.isArray(data)) {
          const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
          const today = days[new Date().getDay()];
          const mySchedules = data.filter((d: any) => String(d.teacher_id) === String(user?.id) && d.day === today);
          
          const mapped = mySchedules.map((d: any) => ({
            time: (d.start_time?.substring(0,5) || '') + ' - ' + (d.end_time?.substring(0,5) || ''),
            class: d.class_name,
            subject: d.subject_name
          }));
          
          mapped.sort((a, b) => a.time.localeCompare(b.time));
          setSchedules(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch schedules', err);
      } finally {
        setLoadingSchedules(false);
      }
    };
    if (user?.id) fetchSchedules();
  }, [user]);`;

code = code.replace(targetState, replaceState);

const targetTable = `            <div className="space-y-2">
              
              {[].length > 0 ? [].map((schedule, i) => { /* original map would go here */ return null; }) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-center">
                  <Calendar className="w-6 h-6 text-slate-300 mb-2" />
                  <p className="text-[10px] font-bold text-slate-500">Tidak ada jadwal</p>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5">Belum ada data dari database</p>
                </div>
              )}

            </div>`;
const replaceTable = `            <div className="space-y-2">
              
              {loadingSchedules ? (
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-center">
                  <p className="text-[10px] font-bold text-slate-500">Memuat jadwal...</p>
                </div>
              ) : schedules.length > 0 ? schedules.map((schedule, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg border border-slate-100 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{schedule.time}</span>
                    <span className="text-[10px] text-slate-500">{schedule.class}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-emerald-700">{schedule.subject}</span>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-6 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl text-center">
                  <Calendar className="w-6 h-6 text-slate-300 mb-2" />
                  <p className="text-[10px] font-bold text-slate-500">Tidak ada jadwal</p>
                  <p className="text-[9px] font-medium text-slate-400 mt-0.5">Hari ini tidak ada jadwal mengajar</p>
                </div>
              )}

            </div>`;

code = code.replace(targetTable, replaceTable);

fs.writeFileSync('src/pages/MobileDashboard.tsx', code);
