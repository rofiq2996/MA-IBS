const fs = require('fs');
let code = fs.readFileSync('src/pages/DashboardGuru.tsx', 'utf-8');

if (!code.includes('recharts')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/context\/AuthContext';/,
    "import { useAuth } from '../context/AuthContext';\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';"
  );
  
  const chartCode = `
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="w-1 h-4 bg-emerald-500 rounded"></span>
              <CardTitle>Rata-rata Nilai Siswa (Bulan Ini)</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Mg 1', 'X-IPA 1': 78, 'XI-IPA 3': 82, 'XII-IPS 2': 75 },
                { name: 'Mg 2', 'X-IPA 1': 80, 'XI-IPA 3': 85, 'XII-IPS 2': 78 },
                { name: 'Mg 3', 'X-IPA 1': 82, 'XI-IPA 3': 84, 'XII-IPS 2': 81 },
                { name: 'Mg 4', 'X-IPA 1': 85, 'XI-IPA 3': 88, 'XII-IPS 2': 83 },
              ]} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <Line type="monotone" dataKey="X-IPA 1" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="XI-IPA 3" stroke="#6366f1" strokeWidth={2} />
                <Line type="monotone" dataKey="XII-IPS 2" stroke="#f59e0b" strokeWidth={2} />
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
`;

  // Insert chart after the 'Pusat Kontrol CBT' block, wait, let's insert it inside the grid
  // In DashboardGuru, we have:
  // <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  //   <Card className="lg:col-span-2">...</Card>
  //   <div className="space-y-6"> <Card>Pusat Kontrol CBT</Card> </div>
  // </div>
  code = code.replace(
    /<\/div>\s*<\/div>\s*\)\;/g,
    "</div>\n" + chartCode + "\n</div>\n  );"
  );
  
  fs.writeFileSync('src/pages/DashboardGuru.tsx', code);
  console.log('DashboardGuru patched with recharts');
}
