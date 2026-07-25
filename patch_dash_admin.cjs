const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardAdmin.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/context\/AuthContext';/,
    "import { useAuth } from '../context/AuthContext';\nimport { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
  );
  
  const chartCode = `
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-4 bg-emerald-500 rounded"></span>
                  <CardTitle>Kehadiran Mingguan</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Senin', Hadir: 400, Sakit: 10, Izin: 5, Alpa: 2 },
                  { name: 'Selasa', Hadir: 390, Sakit: 15, Izin: 8, Alpa: 4 },
                  { name: 'Rabu', Hadir: 410, Sakit: 5, Izin: 2, Alpa: 0 },
                  { name: 'Kamis', Hadir: 395, Sakit: 12, Izin: 6, Alpa: 4 },
                  { name: 'Jumat', Hadir: 380, Sakit: 20, Izin: 10, Alpa: 7 },
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="Hadir" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Sakit" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Izin" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
`;

  // Insert chart after the 'Ringkasan Kehadiran Hari Ini' card
  code = code.replace(
    /<\/Card>\s*<Card>\s*<CardHeader>\s*<div className="flex items-center gap-2">\s*<span className="w-1 h-4 bg-emerald-500 rounded"><\/span>\s*<CardTitle>Aktivitas Sistem Terakhir<\/CardTitle>/,
    "</Card>\n" + chartCode + "\n          <Card>\n            <CardHeader>\n              <div className=\"flex items-center gap-2\">\n                <span className=\"w-1 h-4 bg-emerald-500 rounded\"></span>\n                <CardTitle>Aktivitas Sistem Terakhir</CardTitle>"
  );
  
  fs.writeFileSync('src/pages/DashboardAdmin.tsx', code);
  console.log('DashboardAdmin patched with recharts');
}
