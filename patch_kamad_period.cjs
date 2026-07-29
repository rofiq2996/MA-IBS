const fs = require('fs');
let code = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

// Set default period to 'Harian'
code = code.replace("const [reportPeriod, setReportPeriod] = useState('Mingguan');", "const [reportPeriod, setReportPeriod] = useState('Harian');");

// Add weeklyStats to mock data
const mockTasksMatch = `
          if (category === 'wali_kelas') {
            tasks.push({ name: 'Periksa Pantauan Pagi Siswa', status: 'selesai', time: '07:05 WIB' });
            tasks.push({ name: 'Absensi Sholat Zuhur Siswa', status: 'belum', time: 'Dalam Jam Kerja' });
          }

          return {
            id: u.id,
            name: u.name,
            role: mainRole,
            kelas: u.class_name || '-',
            category: category,
            tasks: tasks
          };
`;

const mockTasksReplace = `
          if (category === 'wali_kelas') {
            tasks.push({ name: 'Periksa Pantauan Pagi Siswa', status: 'selesai', time: '07:05 WIB' });
            tasks.push({ name: 'Absensi Sholat Zuhur Siswa', status: 'belum', time: 'Dalam Jam Kerja' });
          }
          
          // Generate mock weekly stats
          const mockCompletionRate = 100 - ((index * 7) % 35);
          const mockViolations = (index * 3) % 8;

          return {
            id: u.id,
            name: u.name,
            role: mainRole,
            kelas: u.class_name || '-',
            category: category,
            tasks: tasks,
            weeklyStats: {
              completionRate: mockCompletionRate,
              violations: mockViolations
            }
          };
`;

code = code.replace(mockTasksMatch, mockTasksReplace);

// Add Period Toggle to Header
const headerMatch = `      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk Guru & Wali Kelas.</p>
        </div>
      </div>`;

const headerReplace = `      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">Kinerja Staf Real-time</h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">Monitoring pengerjaan jobdesk staf.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
          <button
            onClick={() => setReportPeriod('Harian')}
            className={\`px-4 py-2 rounded-md text-xs font-bold transition-all \${
              reportPeriod === 'Harian' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }\`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setReportPeriod('Mingguan')}
            className={\`px-4 py-2 rounded-md text-xs font-bold transition-all \${
              reportPeriod === 'Mingguan' 
                ? 'bg-white text-emerald-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }\`}
          >
            Pekan Ini
          </button>
        </div>
      </div>`;

code = code.replace(headerMatch, headerReplace);

// Update List Layout
const listItemMatch = `                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-1 sm:mt-0 border-t border-slate-100 sm:border-0 pt-2 sm:pt-0">
                      <div className={\`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                        <SummaryIcon className="w-4 h-4" />
                        {summary.label}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-[10px] sm:text-xs font-bold gap-1.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto h-8 sm:h-9"
                        onClick={() => setSelectedStaf(staf)}
                      >
                        <Eye className="w-3.5 h-3.5 shrink-0" />
                        Lihat Jobdesk
                      </Button>
                    </div>`;

const listItemReplace = `                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between sm:justify-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 border-t border-slate-100 sm:border-0 pt-3 sm:pt-0">
                      {reportPeriod === 'Harian' ? (
                        <>
                          <div className={\`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border \${summary.color}\`}>
                            <SummaryIcon className="w-4 h-4 shrink-0" />
                            {summary.label}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-[10px] sm:text-xs font-bold gap-1.5 text-indigo-700 border-indigo-200 hover:bg-indigo-50 w-full sm:w-auto h-8 sm:h-9"
                            onClick={() => setSelectedStaf(staf)}
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                            Lihat Jobdesk
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Capaian</p>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={\`h-full rounded-full \${staf.weeklyStats.completionRate >= 80 ? 'bg-emerald-500' : staf.weeklyStats.completionRate >= 50 ? 'bg-amber-500' : 'bg-rose-500'}\`}
                                  style={{ width: \`\${staf.weeklyStats.completionRate}%\` }}
                                />
                              </div>
                              <span className="text-xs font-black text-slate-700">{staf.weeklyStats.completionRate}%</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pelanggaran</p>
                            <span className={\`inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold \${staf.weeklyStats.violations > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}\`}>
                              {staf.weeklyStats.violations}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>`;

code = code.replace(listItemMatch, listItemReplace);

// Change the title dynamically
code = code.replace(
  '<CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 m-0">Daftar Kinerja Staf Hari Ini</CardTitle>',
  '<CardTitle className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 m-0">{reportPeriod === \'Harian\' ? \'Daftar Kinerja Staf Hari Ini\' : \'Rapor Kinerja Pekan Ini\'}</CardTitle>'
);

fs.writeFileSync('src/pages/KamadPages.tsx', code);
