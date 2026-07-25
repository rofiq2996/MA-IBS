const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardWalas.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ cn \} from '\.\.\/lib\/utils';/,
    "import { cn } from '../lib/utils';\nimport { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
  );
  
  const chartCode = `
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="w-1 h-4 bg-emerald-500 rounded"></span>
            <CardTitle>Trend Kehadiran Kelas (Bulan Ini)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={[
              { name: 'Mg 1', Hadir: 95 },
              { name: 'Mg 2', Hadir: 98 },
              { name: 'Mg 3', Hadir: 96 },
              { name: 'Mg 4', Hadir: 99 },
            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[90, 100]} />
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <Tooltip />
              <Area type="monotone" dataKey="Hadir" stroke="#10b981" fillOpacity={1} fill="url(#colorHadir)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
`;

  // Insert chart before the final Card (Pemantauan Pagi)
  code = code.replace(
    /<Card>\s*<CardHeader className="flex flex-row items-center justify-between">\s*<div className="flex items-center gap-2">\s*<span className="w-1 h-4 bg-emerald-500 rounded"><\/span>\s*<CardTitle>Status Pemantauan Pagi<\/CardTitle>/,
    chartCode + "\n      <Card>\n        <CardHeader className=\"flex flex-row items-center justify-between\">\n          <div className=\"flex items-center gap-2\">\n            <span className=\"w-1 h-4 bg-emerald-500 rounded\"></span>\n            <CardTitle>Status Pemantauan Pagi</CardTitle>"
  );
  
  fs.writeFileSync('src/pages/DashboardWalas.tsx', code);
  console.log('DashboardWalas patched with recharts');
}
