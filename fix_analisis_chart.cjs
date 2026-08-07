const fs = require('fs');
let file = fs.readFileSync('src/pages/GuruPages.tsx', 'utf8');

const oldComponent = `export function AnalisisSiswa() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Analisis Siswa</h1>
      <Card>
        <CardHeader><CardTitle>Grafik Perkembangan Nilai</CardTitle></CardHeader>
        <CardContent>
          <div className="h-48 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center">
            <span className="text-slate-400 font-medium">Grafik akan ditampilkan di sini (Integrasi Recharts)</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

const newComponent = `import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

export function AnalisisSiswa() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<any[]>([]);
  const [teachingAssignments, setTeachingAssignments] = useState<any[]>([]);

  useEffect(() => {
    apiClient('/crud.php?table=grades').then(data => {
      if (Array.isArray(data)) setGrades(data);
    }).catch(console.error);

    apiClient('/crud.php?table=teaching_assignments').then(data => {
      if (Array.isArray(data)) setTeachingAssignments(data);
    }).catch(console.error);
  }, []);

  const teacherAssignments = teachingAssignments.filter((a: any) => String(a.teacher_id) === String(user?.id));
  const assignedClasses = Array.from(new Set(teacherAssignments.map(a => a.class_name))).filter(Boolean) as string[];

  // Prepare data for chart: average UH, UTS, UAS per class
  const chartData = assignedClasses.map(cls => {
    const classGrades = grades.filter(g => g.class_name === cls);
    const uhGrades = classGrades.filter(g => g.type === 'UH').map(g => Number(g.score));
    const utsGrades = classGrades.filter(g => g.type === 'UTS').map(g => Number(g.score));
    const uasGrades = classGrades.filter(g => g.type === 'UAS').map(g => Number(g.score));

    return {
      name: cls,
      UH: uhGrades.length ? Math.round(uhGrades.reduce((a,b)=>a+b,0)/uhGrades.length) : 0,
      UTS: utsGrades.length ? Math.round(utsGrades.reduce((a,b)=>a+b,0)/utsGrades.length) : 0,
      UAS: uasGrades.length ? Math.round(uasGrades.reduce((a,b)=>a+b,0)/uasGrades.length) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold tracking-tight text-slate-800">Analisis Siswa</h1>
      <Card>
        <CardHeader><CardTitle>Grafik Perkembangan Nilai Rata-rata per Kelas</CardTitle></CardHeader>
        <CardContent>
          <div className="h-80 bg-white border border-slate-200 rounded-lg p-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="UH" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="UTS" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                  <Bar dataKey="UAS" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-medium">
                Belum ada data nilai untuk kelas yang diajarkan.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

file = file.replace(oldComponent, newComponent);
fs.writeFileSync('src/pages/GuruPages.tsx', file);
