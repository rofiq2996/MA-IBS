const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'KamadPages.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const targetFunction = `export function KamadIbadahGuru() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-slate-800">Monitoring Ibadah Guru</h1>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500 text-sm">Data pemantauan ibadah guru akan ditampilkan di sini.</p>
        </CardContent>
      </Card>
    </div>
  );
}`;

const newFunction = `export function KamadIbadahGuru() {
  const [users, setUsers] = useState<any[]>([]);
  const [ibadahRecords, setIbadahRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState(new Date().toLocaleDateString('en-CA'));
  const [viewMode, setViewMode] = useState<'harian' | 'mingguan'>('harian');
  
  // Calculate current week string (e.g., "2026-W31")
  const getWeekString = (d: Date) => {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return \`\${date.getFullYear()}-W\${week.toString().padStart(2, '0')}\`;
  };
  const [weekFilter, setWeekFilter] = useState(getWeekString(new Date()));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [uRes, iRes] = await Promise.all([
        apiClient('/crud.php?table=users'),
        apiClient('/crud.php?table=ibadah_guru').catch(() => [])
      ]);
      
      const teachers = (uRes || []).filter((u: any) => {
        const r = u.roles ? (typeof u.roles === 'string' ? JSON.parse(u.roles) : u.roles) : [u.role];
        return r.includes('guru') || r.includes('walas') || r.includes('guru_quran');
      });
      setUsers(teachers);
      setIbadahRecords(iRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: string) => {
    const existing = ibadahRecords.find((r: any) => String(r.user_id) === String(userId) && r.date === dateFilter);
    const currentKeterangan = existing ? existing.keterangan : '';
    
    try {
      if (existing) {
        await apiClient(\`/crud.php?table=ibadah_guru&id=\${existing.id}\`, {
          method: 'PUT',
          body: JSON.stringify({ status, keterangan: currentKeterangan })
        });
        setIbadahRecords(ibadahRecords.map(r => r.id === existing.id ? { ...r, status } : r));
      } else {
        const res = await apiClient('/crud.php?table=ibadah_guru', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, date: dateFilter, status, keterangan: currentKeterangan })
        });
        // fetch again to get id, or just mock it for now
        fetchData();
      }
    } catch (e) {
      console.error(e);
      window.alert('Gagal menyimpan data ibadah');
    }
  };

  const handleKeteranganChange = async (userId: string, keterangan: string) => {
    const existing = ibadahRecords.find((r: any) => String(r.user_id) === String(userId) && r.date === dateFilter);
    const currentStatus = existing ? existing.status : 'Tidak Jamaah';
    
    try {
      if (existing) {
        await apiClient(\`/crud.php?table=ibadah_guru&id=\${existing.id}\`, {
          method: 'PUT',
          body: JSON.stringify({ status: currentStatus, keterangan })
        });
        setIbadahRecords(ibadahRecords.map(r => r.id === existing.id ? { ...r, keterangan } : r));
      } else {
        const res = await apiClient('/crud.php?table=ibadah_guru', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, date: dateFilter, status: currentStatus, keterangan })
        });
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getWeekRange = (weekStr: string) => {
    if (!weekStr) return { start: new Date(), end: new Date() };
    const [year, week] = weekStr.split('-W');
    const simple = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
    const dow = simple.getDay();
    const ISOweekStart = simple;
    if (dow <= 4) ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
    else ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
    
    const end = new Date(ISOweekStart);
    end.setDate(ISOweekStart.getDate() + 6);
    return { start: ISOweekStart, end: end };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Monitoring Ibadah Guru</h1>
          <p className="text-slate-500 mt-1 text-sm">Pantau pelaksanaan sholat jamaah guru</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('harian')}
            className={\`px-4 py-2 text-sm font-bold rounded-md transition-all \${viewMode === 'harian' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
          >
            Harian
          </button>
          <button
            onClick={() => setViewMode('mingguan')}
            className={\`px-4 py-2 text-sm font-bold rounded-md transition-all \${viewMode === 'mingguan' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}\`}
          >
            Mingguan
          </button>
        </div>
      </div>

      <Card className="border-slate-200/60 shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-base font-bold text-slate-800">
              {viewMode === 'harian' ? 'Data Jamaah Zuhur Harian' : 'Rekapitulasi Mingguan'}
            </CardTitle>
            {viewMode === 'harian' ? (
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
              />
            ) : (
              <input
                type="week"
                value={weekFilter}
                onChange={(e) => setWeekFilter(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm bg-white"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : viewMode === 'harian' ? (
            <div className="divide-y divide-slate-100">
              {users.map((u, i) => {
                const record = ibadahRecords.find(r => String(r.user_id) === String(u.id) && r.date === dateFilter);
                return (
                  <div key={i} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 md:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center shrink-0">
                      <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-lg px-3 py-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={\`status-\${u.id}\`} 
                            checked={record?.status === 'Jamaah'}
                            onChange={() => handleStatusChange(u.id, 'Jamaah')}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                          />
                          <span className="text-sm font-semibold text-slate-700">Jamaah</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="radio" 
                            name={\`status-\${u.id}\`} 
                            checked={record?.status === 'Tidak Jamaah'}
                            onChange={() => handleStatusChange(u.id, 'Tidak Jamaah')}
                            className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                          />
                          <span className="text-sm font-semibold text-slate-700">Tidak Jamaah</span>
                        </label>
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Keterangan..."
                        value={record?.keterangan || ''}
                        onChange={(e) => {
                          const newRecords = [...ibadahRecords];
                          const idx = newRecords.findIndex(r => String(r.user_id) === String(u.id) && r.date === dateFilter);
                          if (idx >= 0) newRecords[idx].keterangan = e.target.value;
                          else newRecords.push({ user_id: u.id, date: dateFilter, status: 'Tidak Jamaah', keterangan: e.target.value });
                          setIbadahRecords(newRecords);
                        }}
                        onBlur={(e) => handleKeteranganChange(u.id, e.target.value)}
                        className="w-full sm:w-48 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users.map((u, i) => {
                const { start, end } = getWeekRange(weekFilter);
                const startStr = start.toLocaleDateString('en-CA');
                const endStr = end.toLocaleDateString('en-CA');
                
                const weekRecords = ibadahRecords.filter(r => 
                  String(r.user_id) === String(u.id) && 
                  r.date >= startStr && 
                  r.date <= endStr
                );
                
                const jamaahCount = weekRecords.filter(r => r.status === 'Jamaah').length;
                const tidakJamaahCount = weekRecords.filter(r => r.status === 'Tidak Jamaah').length;
                
                return (
                  <div key={i} className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold uppercase shrink-0">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 min-w-[80px]">
                        <span className="text-xs font-bold text-emerald-600 uppercase">Jamaah</span>
                        <span className="text-xl font-black text-emerald-700">{jamaahCount}</span>
                      </div>
                      <div className="flex flex-col items-center bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 min-w-[80px]">
                        <span className="text-xs font-bold text-rose-600 uppercase">Tidak</span>
                        <span className="text-xl font-black text-rose-700">{tidakJamaahCount}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}`;

content = content.replace(targetFunction, newFunction);
fs.writeFileSync(filePath, content);
